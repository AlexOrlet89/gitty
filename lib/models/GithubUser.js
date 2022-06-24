const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  email;
  username;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.username = row.username;
  }

  static async create({ email, username }) {
    if (!email) throw new Error('USERNAME Required!!!!');

    const { rows } = await pool.query(
      `
        INSERT INTO github_users (email, username)
            VALUES ($1, $2)
            RETURNING *`,
      [email, username]
    );
    return new GithubUser(rows[0]);
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM github_users
      WHERE username=$1
      `,
      [username]
    );

    if (!rows[0]) return null;

    return new GithubUser(rows[0]);
  }

  toJSON() {
    return { ...this };
  }
};
