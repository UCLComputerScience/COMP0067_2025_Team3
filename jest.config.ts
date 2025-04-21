const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './'
})

const customJestConfig = {
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
    '\\.(ttf|woff|woff2|eot|otf)$': '<rootDir>/__mocks__/fileMock.js'
  },

  transformIgnorePatterns: ['node_modules/(?!@fontsource)']
}

module.exports = createJestConfig(customJestConfig)
