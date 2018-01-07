import { Component, OnInit } from '@angular/core';
import {WalletService} from "../wallet.service";
import {NotificationService} from "../notification.service";

@Component({
  selector: 'app-configure-wallet',
  templateUrl: './configure-wallet.component.html',
  styleUrls: ['./configure-wallet.component.css']
})
export class ConfigureWalletComponent implements OnInit {
  activePanel = 0;

  newWalletID = '';
  newWalletSeed = '';

  importSeedModel = '';

  nodeWalletID = '';
  appWalletID = '';

  constructor(private walletService: WalletService, private notificationService: NotificationService) { }

  async ngOnInit() {
    // Load the Wallet ID from the node config, load the app config wallet ID
    const nodeConfig = await this.walletService.walletApi.getNodeConfig();
    const appConfig = await this.walletService.walletApi.getAppConfig();

    this.nodeWalletID = nodeConfig.wallet;
    this.appWalletID = appConfig.walletID;
  }

  async importConfiguredWallet() {
    const updated = await this.walletService.walletApi.saveAppConfig({ walletID: this.nodeWalletID });
    this.activePanel = 4;
    this.appWalletID = this.nodeWalletID;
    this.notificationService.sendSuccess(`Successfully imported wallet from RaiBlock Node!`);

    await this.walletService.setWalletID(this.nodeWalletID);
  }

  async importExistingWallet() {
    const existingSeed = this.importSeedModel;

    const newWallet = await this.walletService.walletApi.walletCreate();
    const changed = await this.walletService.walletApi.walletChangeSeed(newWallet.wallet, existingSeed);

    if (changed && changed.success !== undefined) {
      this.activePanel = 4;
      this.appWalletID = newWallet.wallet;
      this.notificationService.sendSuccess(`Successfully imported existing wallet!`);

      await this.walletService.setWalletID(newWallet.wallet);
    }

  }

  async createNewWallet() {
    const seedRes = await this.walletService.walletApi.generateNewSeed();
    const newSeed = seedRes.seed;

    // Create a new wallet, then transfer the seed over to it.
    const newWallet = await this.walletService.walletApi.walletCreate();
    const changed = await this.walletService.walletApi.walletChangeSeed(newWallet.wallet, newSeed);

    if (changed && changed.success !== undefined) {
      this.newWalletSeed = newSeed;
      this.newWalletID = newWallet.wallet;

      this.activePanel = 3;
      this.appWalletID = newWallet.wallet;
      this.notificationService.sendSuccess(`Successfully created new wallet! Make sure to write down your seed!`);

      await this.walletService.setWalletID(this.newWalletID);
    }
  }

  confirmNewSeed() {
    this.newWalletSeed = '';
    this.newWalletID = '';

    this.activePanel = 4;
  }

  setPanel(panel) {
    this.activePanel = panel;
  }

}
