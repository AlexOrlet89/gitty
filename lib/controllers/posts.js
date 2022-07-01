const { Router } = require('express');
const Post = require('../models/Post');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const posts = await Post.getAll();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});
