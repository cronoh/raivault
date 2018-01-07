import { Component, OnInit } from '@angular/core';
import {RpcService} from "../rpc.service";
import {WalletService} from "../wallet.service";
import {NotificationService} from "../notification.service";

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css']
})
export class ReceiveComponent implements OnInit {
  pendingAccountModel = 0;

  accounts = [];
  pendingBlocks = [];

  constructor(private walletApi: RpcService, private walletService: WalletService, private notificationService: NotificationService) { }

  async ngOnInit() {
    this.pendingBlocks = await this.walletService.loadPendingTransactions();

    // TODO: This should pull from walletService observable instead
    const accounts = await this.walletApi.accountList(this.walletService.walletID);

    this.accounts = accounts.accounts;
  }

  async searchIncoming() {
    await this.walletApi.searchPending(this.walletService.walletID);
  }

  async loadPendingAll() {
    this.pendingBlocks = [];

    const pending = await this.walletService.walletApi.walletPending(this.walletService.walletID, 20);
    if (!pending || !pending.blocks) return;

    for (let account in pending.blocks) {
      if (!pending.blocks.hasOwnProperty(account)) continue;
      for (let block in pending.blocks[account]) {
        if (!pending.blocks[account].hasOwnProperty(block)) continue;
        const pendingTx = {
          block: block,
          amount: pending.blocks[account][block].amount,
          source: pending.blocks[account][block].source,
          account: account,
        };
        this.pendingBlocks.push(pendingTx);
      }
    }
  }

  async loadPendingAccount(account) {
    this.pendingBlocks = [];

    const pending = await this.walletApi.pending(account, 10);
    if (!pending || !pending.blocks) return;

    for (let block in pending.blocks) {
      const pendingTx = {
        block: block,
        amount: pending.blocks[block].amount,
        source: pending.blocks[block].source,
        account: account,
      };
      this.pendingBlocks.push(pendingTx);
    }
  }

  async getPending(account) {
    if (!account || account == 0) {
      await this.loadPendingAll();
    } else {
      await this.loadPendingAccount(account);
    }
  }

  async receivePending(account, block) {
    if (this.walletService.walletIsLocked()) {
      return this.notificationService.sendWarning(`Wallet must be unlocked`);
    }
    const response = await this.walletApi.receive(this.walletService.walletID, account, block);

    // TODO: trigger reload of wallet?
    console.log(response);
    await this.walletService.reloadWallet();
    await this.walletService.loadAccounts();
    await this.getPending(this.pendingAccountModel);

    this.notificationService.sendSuccess(`Successfully received XRB`);
  }

}
