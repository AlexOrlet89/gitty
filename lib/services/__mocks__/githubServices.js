const exchangeCodeForToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeCodeForToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const getGithubProfile = async (token) => {
  console.log(`MOCK INVOKED: getGithubProfile(${token})`);
  return {
    // avatar_url: 'any',
    login: 'fake',
    email: 'fake@gmail.com',
  };
};
//
module.exports = { exchangeCodeForToken, getGithubProfile };
