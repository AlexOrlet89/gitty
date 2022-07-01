const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Post = require('../lib/models/Post');

jest.mock('../lib/services/githubServices');

const registerAndLogin = async () => {
  const user = request.agent(app);

  await user.get('/api/v1/github/login/callback?code=1');

  return user;
};

describe('user testing', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it.skip('should redirect to the github oauth page on login', async () => {
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
  it('authenticated users can view posts', async () => {
    const res = await request(app).get('/api/v1/posts');
    expect(res.status).toBe(401);
    //log in a user...
    const user = await registerAndLogin();

    const posts = await user.get('/api/v1/posts');
    console.log(posts.body);
    // expect(user.body).toEqual({
    //   id: '1',
    //   email: 'fake@gmail.com',
    //   username: 'fake',
    //   iat: expect.any(Number),
    //   exp: expect.any(Number),
    // });
    // console.log(user.req.body);
    //try and access posts
    expect(posts.status).toBe(200);
  });

  it.only('authenticated users can post', async () => {
    const user = await registerAndLogin();
    const response = await user.post('/api/v1/posts').send({
      title: 'new',
      description: 'new',
    });
    expect(response.status).toBe(200);
  });
  afterAll(() => {
    pool.end();
  });
});
