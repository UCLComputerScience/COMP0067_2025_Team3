const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './'
})

const customJestConfig = {
  testEnvironment: 'jsdom',

  // ✅ This mocks .css files like from fontsource
  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
    '\\.(ttf|woff|woff2|eot|otf)$': '<rootDir>/__mocks__/fileMock.js'
  },

  // ✅ This makes sure fontsource gets transformed
  transformIgnorePatterns: ['node_modules/(?!@fontsource)']
}

module.exports = createJestConfig(customJestConfig)
