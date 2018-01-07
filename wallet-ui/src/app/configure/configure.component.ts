import {Component, OnInit, ViewChild} from '@angular/core';
import {WalletService} from "../wallet.service";
import {NotificationService} from "../notification.service";

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {

  walletID = 'abc';
  rpcAddress = '127.0.0.1';
  rpcPort = '7071';
  rpcEnable = false;
  rpcControlEnable = false;

  currentStep = 0;
  appConfigFound = false;
  nodeConfigFound = false;

  appConfigNodeConfigModel = '';
  appConfigNodeApiModel = '';

  node = this.walletService.node;

  constructor(public walletService: WalletService, private notificationService: NotificationService) { }

  async ngOnInit() {
    // this.loadWalletID();

    await this.loadAppConfig();

    await this.loadNodeConfig();
  }

  checkNodeStatus = this.walletService.checkNodeStatus;

  async loadAppConfig() {
    try {
      const appConfig = await this.walletService.walletApi.getAppConfig();

      this.appConfigFound = true;
      this.appConfigNodeConfigModel = appConfig.nodeConfigFile;
      this.appConfigNodeApiModel = appConfig.nodeRpcUrl;

    } catch (err) {
      console.log(`Unable to locate app config?`);
    }
  }

  async loadNodeConfig() {
    try {
      const nodeConfig = await this.walletService.walletApi.getNodeConfig();

      if (nodeConfig && nodeConfig.version) {
        this.nodeConfigFound = true;

        this.rpcAddress = nodeConfig.rpc.address;
        this.rpcPort = nodeConfig.rpc.port;
        this.rpcEnable = !!nodeConfig.rpc_enable;
        this.rpcControlEnable = !!nodeConfig.rpc.enable_control;
      }
    } catch (err) {
      console.log(`Unable to locate node config?`);
      this.nodeConfigFound = false;
    }
  }

  async updateNodeConfigLocation() {
    const updateData = {
      nodeConfigFile: this.appConfigNodeConfigModel,
    };
    const updated = await this.walletService.walletApi.saveAppConfig(updateData);

    await this.loadNodeConfig();
  }

  async updateNodeApiLocation() {
    const updateData = {
      nodeRpcUrl: this.appConfigNodeApiModel,
    };
    const updated = await this.walletService.walletApi.saveAppConfig(updateData);
    await this.loadNodeConfig();
    await this.walletService.checkNodeStatus();
  }


  // loadWalletID() {
  //   const localStorage = window.localStorage;
  //   const walletID = localStorage.getItem('walletID');
  //   console.log('Loaded wallet id from local store: ', walletID);
  //   if (walletID && walletID.length > 10) {
  //     this.walletID = walletID;
  //   }
  // }

  // saveWalletID(walletID) {
  //   console.log('Saving wallet id? ', walletID);
  //   window.localStorage.setItem('walletID', walletID);
  //   this.walletService.walletID = walletID;
  //   this.walletID = walletID;
  // }



  async saveConfig() {
    await this.walletService.setWalletID(this.walletID);
    // We also need to know if the node is online...
    const newConfig = {
      wallet: this.walletID,
      rpc_enable: this.rpcEnable,
      rpc: {
        address: this.rpcAddress,
        port: this.rpcPort,
        enable_control: this.rpcControlEnable,
      }
    };

    const config = await this.walletService.walletApi.saveNodeConfig(newConfig);

    await this.walletService.reloadWallet();
  }

}
