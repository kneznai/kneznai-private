module.exports = {
  testEnvironment: 'node',
  reporters: [
    'default'],
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testMatch: ['**/specs/*.spec.*'],
  globals: {
    testTimeout: 10000,
  },
  verbose: true,
};