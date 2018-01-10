import { Component, OnInit } from '@angular/core';
import {RpcService} from "../rpc.service";
import {WalletService} from "../wallet.service";
import {NotificationService} from "../notification.service";
import {ModalService} from "../modal.service";

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css']
})
export class ReceiveComponent implements OnInit {
  accounts$ = this.walletService.accounts$;

  pendingAccountModel = 0;
  pendingBlocks = [];

  constructor(private walletService: WalletService, private notificationService: NotificationService, public modal: ModalService) { }

  async ngOnInit() {
    this.pendingBlocks = await this.walletService.loadPendingTransactions();
  }

  async searchIncoming() {
    if (this.walletService.walletIsLocked()) return this.notificationService.sendWarning(`Wallet must be unlocked`);
    try {
      const started = await this.walletService.walletApi.searchPending(this.walletService.wallet.id);
      if (started && started.started == 'true') {
        this.notificationService.sendSuccess(`Successfully issued request to search the network for pending transactions`);
      } else {
        this.notificationService.sendError(`Node rejected the discovery request - maybe the wallet is locked?`);
      }
    } catch (err) {
      this.notificationService.sendError(`Unable to issue request`);
    }
  }

  async loadPendingForAll() {
    this.pendingBlocks = [];

    const pending = await this.walletService.walletApi.walletPending(this.walletService.wallet.id, 20);
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

  async loadPendingForAccount(account) {
    this.pendingBlocks = [];

    const pending = await this.walletService.walletApi.pending(account, 10);
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
      await this.loadPendingForAll();
    } else {
      await this.loadPendingForAccount(account);
    }
  }

  async receivePending(pendingBlock) {
    if (this.walletService.walletIsLocked()) return this.notificationService.sendWarning(`Wallet must be unlocked`);
    pendingBlock.loading = true;
    const response = await this.walletService.walletApi.receive(this.walletService.wallet.id, pendingBlock.account, pendingBlock.block);
    pendingBlock.loading = false;

    if (response && response.block) {
      this.notificationService.sendSuccess(`Successfully received XRB`);
      await this.walletService.reloadWallet();
    } else {
      this.notificationService.sendError(`Unable to receive block, it might have been received by the node.`);
    }

    await this.getPending(this.pendingAccountModel); // Reload pending search
  }

}
