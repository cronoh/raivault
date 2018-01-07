const { app } = require('electron');

const fs = require('fs');
const os = require('os');
const path = require('path');

const defaultAppConfig = {
  nodeRpcUrl: 'http://127.0.0.1:7076',
  walletID: '',
  nodeConfigFile: getNodeConfigPath(),
};

function getNodeConfigPath() {
  switch (os.platform()) {
    default:
    case 'darwin': return path.resolve(`${app.getPath('appData')}/../RaiBlocks/config.json`);
    case 'win32': return path.resolve(`${app.getPath('appData')}/RaiBlocks/config.json`);
  }
}

function getAppConfigPath() {
  return path.resolve(path.join(app.getPath('userData'), 'config.json'));
}

async function getJSONFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) return reject(err);
      try {
        const configData = JSON.parse(data);
        return resolve(configData);
      } catch (err) {
        return reject(err);
      }
    });
  });
}

async function saveJSONFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), (err, done) => {
      if (err) return reject(err);

      return resolve(done);
    });
  })
}

async function getNodeConfig() {
  const appConfig = await getAppConfig();
  return await getJSONFile(appConfig.nodeConfigFile);
}

async function saveNodeConfig(data) {
  const appConfig = await getAppConfig();
  return await saveJSONFile(appConfig.nodeConfigFile, data);
}

async function getAppConfig() {
  try {
    return await getJSONFile(getAppConfigPath());
  } catch (err) {
    // Assuming error is that no file exists, so going to attempt to create a new file
    await saveAppConfig(defaultAppConfig);
    return defaultAppConfig;
  }
}

async function saveAppConfig(data) {
  return await saveJSONFile(getAppConfigPath(), data);
}

async function createAppConfig() {
  try {
    await getAppConfig();
  } catch (err) {
    await saveAppConfig(defaultAppConfig);
  }
}

module.exports = {
  createAppConfig,
  getAppConfig,
  getAppConfigPath,
  saveAppConfig,
  getNodeConfig,
  saveNodeConfig,
  getNodeConfigPath,
  getJSONFile,
  saveJSONFile,
}