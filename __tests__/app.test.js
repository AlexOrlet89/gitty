const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/githubServices');

describe('user testing', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should redirect to the github oauth page on login', async () => {
    const res = await request(app).get('/api/v1/github/login');
    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });
  it('mock user should log in using their github account', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=1')
      .redirects(1);
    expect(res.body).toEqual({
      id: '1',
      email: 'fake@gmail.com',
      username: 'fake',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
  it('authenticated users can view geets', async () => {
    const res = await request(app).get('/api/v1/posts');
    expect(res.status).toBe(401);
    //log in a user...
    const user = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=1')
      .redirects(1);
    expect(user.body).toEqual({
      id: '1',
      email: 'fake@gmail.com',
      username: 'fake',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
    //try and access posts
    const posts = await request(app).get('/api/v1/posts');
    expect(posts.status).toBe(200);
  });
  afterAll(() => {
    pool.end();
  });
});
