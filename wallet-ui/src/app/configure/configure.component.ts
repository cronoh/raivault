import {Component, OnInit, ViewChild} from '@angular/core';
import {WalletService} from "../wallet.service";
import {NotificationService} from "../notification.service";

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})
export class ConfigureComponent implements OnInit {

  rpcAddress = '::ffff:127.0.0.1';
  rpcPort = '7076';
  rpcEnable = false;
  rpcControlEnable = false;

  currentStep = 0;
  appConfigFound = false;
  nodeConfigFound = false;

  showStep1Helper = false;
  showStep2Helper = false;

  appConfigNodeConfigModel = '';
  appConfigNodeApiModel = '';

  node = this.walletService.node;

  constructor(public walletService: WalletService, private notificationService: NotificationService) { }

  async ngOnInit() {
    await this.loadAppConfig();

    await this.loadNodeConfig();
  }

  async loadAppConfig() {
    try {
      const appConfig = await this.walletService.walletApi.getAppConfig();

      this.appConfigFound = true;
      this.appConfigNodeConfigModel = appConfig.nodeConfigFile;
      this.appConfigNodeApiModel = appConfig.nodeRpcUrl;

    } catch (err) {
      this.appConfigFound = false;
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

  async setAutoConfig() {
    this.rpcAddress = '::ffff:127.0.0.1';
    this.rpcPort = '7076';
    this.rpcEnable = true;
    this.rpcControlEnable = true;
    await this.saveConfig();
  }

  async recheckAppConfig() {
    await this.loadAppConfig();
    if (this.appConfigFound) {
      this.notificationService.sendSuccess(`Application settings file created!`);
    } else {
      this.notificationService.sendError(`Unable to create application settings file.  Try restarting the application.`);
    }
  }
  async recheckNodeConfig() {
    await this.loadNodeConfig();
    if (this.nodeConfigFound) {
      this.notificationService.sendSuccess(`RaiBlocks configurations file successfully located!`)
    } else {
      this.notificationService.sendError(`Unable to locate the RaiBlocks configuration file.  Make sure RaiBlocks is installed, or try manual configuration`);
    }
  }

  async updateNodeConfigLocation() {
    const updateData = {
      nodeConfigFile: this.appConfigNodeConfigModel,
    };
    const updated = await this.walletService.walletApi.saveAppConfig(updateData);
    this.notificationService.sendSuccess(`Successfully updated application setting!`);
    await this.loadNodeConfig();
  }

  async updateNodeApiLocation() {
    const updateData = {
      nodeRpcUrl: this.appConfigNodeApiModel,
    };
    const updated = await this.walletService.walletApi.saveAppConfig(updateData);
    this.notificationService.sendSuccess(`Successfully updated application setting!`);
    await this.loadNodeConfig();
    await this.walletService.checkNodeStatus();
  }

  async saveConfig() {
    const newConfig = {
      rpc_enable: this.rpcEnable,
      rpc: {
        address: this.rpcAddress,
        port: this.rpcPort,
        enable_control: this.rpcControlEnable,
      }
    };

    const config = await this.walletService.walletApi.saveNodeConfig(newConfig);
    this.notificationService.sendSuccess(`Successfully updated RaiBlocks settings.  Make sure to restart RaiBlocks!`);

    await this.walletService.reloadWallet();
  }

  async recheckNodeStatus() {
    await this.walletService.checkNodeStatus();
    if (!this.walletService.node.online) {
      this.notificationService.sendError(`Unable to connect to node.  Check settings and make sure RaiBlocks wallet is running`);
    }
  }

}
