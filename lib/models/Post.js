const pool = require('../utils/pool');

module.exports = class Post {
  id;
  user_id;
  geet;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.geet = row.geet;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM geets');

    return rows.map((post) => new Post(post));
  }
};
