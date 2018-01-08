# RaiVault

RaiVault is a desktop application which aims to make it incredibly easy to use the [RaiBlocks cryptocurrency](https://github.com/clemahieu/raiblocks).

![RaiVault Screenshot](https://raivault.s3-us-west-2.amazonaws.com/RaiVaultWallet.png)

RaiVault currently requires you to run a local RaiBlocks wallet to be able to sync with the network.  All communication inside the app is to your own computer and RaiBlocks node - **none of your information is ever transferred to any outside servers**.

#### Important Notice
> If you are already using your local RaiBlocks wallet: **Please back up your wallet seed before using if you haven't already, just incase!**

#

RaiVault is currently in early beta so please submit any bugs or feedback you have in the  [issue tracker](https://github.com/cronoh/raivault/issues/new).

#

# Table of Contents
* [Install](#install-raivault)
* [Development Prerequisites](#development-prerequisites)
* [Application Structure](#application-structure)
* [Development Guide](#development-guide)
* [Build](#build)

# Install RaiVault

Simply head over to the [releases section](https://github.com/cronoh/raivault/releases)  and download the fully compiled binary for your OS to get started!

#

### Everything below is only for contributing to the development of RaiVault
### To download RaiVault go to the [releases section](https://github.com/cronoh/raivault/releases)

#

# Development Prerequisites
- Node Package Manager: [Install NPM](https://www.npmjs.com/get-npm)
- Angular CLI: `npm install -g @angular/cli`

# Application Structure

The application is broken into two separate parts:

- `wallet-ui`: An Angular app that serves as the wallet UI
- `rai-wallet`: An Electron.js app which runs the wallet, saves user settings, and negotiates communication to the RaiBlocks node.

# Development Guide
#### Clone repository and install dependencies
```bash
git clone https://github.com/cronoh/raivault
cd raivault
npm install
cd wallet-ui && npm install
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
