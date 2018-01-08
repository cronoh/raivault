# RaiVault

![RaiVault Screenshot](https://raivault.s3-us-west-2.amazonaws.com/RaiVaultWallet.png)

RaiVault is a desktop application which aims to make it incredibly easy to use the RaiBlocks cryptocurrency.  It is currently in early beta so please submit any bugs or feedback you have.  **Always back up your wallet seeds!**

RaiVault currently requires you to run a local RaiBlocks wallet to be able to sync with the network.  All communication inside the app is to your own computer and RaiBlocks node - none of your information is ever transferred to any outside servers.

# Table of Contents
* [Quick Start](#quick-start)
* [Structure](#structure)
* [Development Prerequisites](#development-prerequisites)
* [Development Guide](#development-guide)
* [Build](#build)

# Quick Start

Simply head over to the [Releases](https://github.com/cronoh/raivault/releases) section and download the fully compiled binary for your OS to get started!

# Structure

The application is broken into two separate parts:

- `wallet-ui`: An Angular app that serves as the wallet UI
- `rai-wallet`: An Electron.js app which runs the wallet, saves user settings, and negotiates communication to the RaiBlocks node.

# Development Prerequisites

```bash
npm install -g @angular/cli
```

# Development Guide
#### Setup
```bash
git clone https://github.com/cronoh/raivault
npm install
cd raivault/wallet-ui && npm install
cd ../rai-wallet && npm install
```

#### Run the app

Run the wallet UI:
```bash
cd wallet-ui
ng serve --open
```

Run the desktop app:
```bash
cd rai-wallet
npm start
```

# Build
Build the wallet UI:
```bash
cd wallet-ui
ng build --prod
```

Build the electron app
```bash
yarn run dist [--win --mac --linux -wml]
```
