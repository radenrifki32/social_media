module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testEnvironment: 'node',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    testRegex: '\\.spec\\.(t|j)s$',
    coverageDirectory: './coverage',
  };
