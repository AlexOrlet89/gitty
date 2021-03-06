const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const jwt = require('jsonwebtoken');

const {
  exchangeCodeForToken,
  getGithubProfile,
} = require('../services/githubServices');
const authenticate = require('../middleware/authenticate');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    try {
      res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`
      );
    } catch (error) {
      console.log(error);
    }
  })
  .get('/login/callback', async (req, res) => {
    const { code } = req.query;

    const githubToken = await exchangeCodeForToken(code);

    const githubProfile = await getGithubProfile(githubToken);

    let user = await GithubUser.findByUsername(githubProfile.login);
    if (!user) {
      user = await GithubUser.create({
        username: githubProfile.login,
        email: githubProfile.email,
      });
    }

    const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });

    res
      .cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
      .redirect('/api/v1/github/dashboard');
  })
  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  });
