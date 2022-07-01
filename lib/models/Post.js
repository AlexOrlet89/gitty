const pool = require('../utils/pool');

module.exports = class Post {
  id;
  title;
  description;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.description = row.description;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM geets');

    return rows.map((post) => new Post(post));
  }

  static async insert({ title, description }) {
    const { rows } = await pool.query(
      'INSERT INTO geets (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    return new Post(rows[0]);
  }
};
