const request = require('request-promise-native');
const express = require('express');
const path = require('path');
const _ = require('lodash');
const crypto = require('crypto');

const config = require('./config');
const proxyUrl = `http://127.0.0.1:7076`;

function configureRoutes(app) {
  const angularDir = path.resolve(path.join(__dirname, '../../wallet-ui/dist'));
  app.use('/', express.static(angularDir)); // This hosts the local app, only when devving to test the production angular app
  app.get('/api/electron/node-config', async (req, res) => {
    res.json({ path: config.getNodeConfigPath() });
  });
  app.get('/api/electron/app-config', async (req, res) => {
    res.json({ path: config.getAppConfigPath() });
  });
  app.get('/api/electron/static', async (req, res) => {
    res.json({ path: angularDir });
  });
  app.post('/api', (req, res) => {
    request({ method: 'post', uri: proxyUrl, body: req.body, json: true })
      .then(proxyRes => res.json(proxyRes))
      .catch(err => res.status(500).json(err.toString()))
  });
  app.get('/api/node-config', async (req, res) => {
    try {
      const nodeConfig = await config.getNodeConfig();
      return res.json(nodeConfig);
    } catch (err) {
      console.log(`Error getting node config`, err.message);
      return res.status(404).json({ error: 'Unable to locate node config' });
    }
  });
  app.post('/api/node-config', async (req, res) => {
    try {
      const nodeConfig = await config.getNodeConfig();
      nodeConfig.rpc_enable = req.body.rpc_enable;
      nodeConfig.rpc = _.assign(nodeConfig.rpc, req.body.rpc);
      await config.saveNodeConfig(nodeConfig);
    } catch (err) {
      console.log(`Error saving node config`, err.message);
      return res.status(400).json({ error: 'Unable to read node config' });
    }
  });
  app.get('/api/app-config', async (req, res) => {
    try {
      const appConfig = await config.getAppConfig();
      return res.json(appConfig);
    } catch (err) {
      console.log(`Error getting app config`, err.message);
      return res.status(404).json({ error: 'Unable to locate app config' });
    }
  });
  app.post('/api/app-config', async (req, res) => {
    try {
      const appConfig = await config.getAppConfig();
      const newConfig = _.assign(appConfig, req.body);
      await config.saveAppConfig(newConfig);
      return res.json(newConfig);
    } catch (err) {
      console.log(`Error saving app config`, err.message);
      return res.status(400).json({ error: 'Unable to read app config' });
    }
  });
  app.post('/api/generate-seed', async (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) return res.status(500).json({ error: err.toString() });

      return res.json({ seed: buffer.toString('hex').toUpperCase() });
    })
  });
}

module.exports = {
  configureRoutes,
};