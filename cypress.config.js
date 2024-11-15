const { defineConfig } = require('cypress');
const { URL } = require('./config.json');

module.exports = defineConfig({
  projectId: '4kuy5u',
  downloadsFolder: 'artifacts/downloads',
  screenshotsFolder: 'artifacts/screenshots',
  videosFolder: 'artifacts/videos',
  watchForFileChanges: false,

  fileServerFolder: 'ecosystem/assets',

  fixtureFolder: '/fixtures',

  e2e: {
    baseUrl: URL,
    supportFile: 'ecosystem/support/index.js',
    specPattern: 'tests/**/*.spec.{js, jsx, ts, tsx}',
  },
})