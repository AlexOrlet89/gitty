const { Router } = require('express');

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
    res.json({ code });
  });