import { Component, OnInit } from '@angular/core';
import {WalletService} from "../wallet.service";
import {NotificationService} from "../notification.service";

@Component({
  selector: 'app-wallet-widget',
  templateUrl: './wallet-widget.component.html',
  styleUrls: ['./wallet-widget.component.css']
})
export class WalletWidgetComponent implements OnInit {
  node = this.walletService.node;
  wallet = this.walletService.wallet;

  unlockPassword = '';

  constructor(private walletService: WalletService, private notificationService: NotificationService) { }

  ngOnInit() {
  }

  async lockWallet() {
    const locked = await this.walletService.lockWallet();
    if (locked) {
      this.notificationService.sendSuccess(`Wallet locked`);
    } else {
      this.notificationService.sendError(`Unable to lock wallet`);
    }
  }

  async unlockWallet() {
    const unlocked = await this.walletService.unlockWallet(this.unlockPassword);
    this.unlockPassword = '';

    const UIkit = (window as any).UIkit;
    UIkit.modal(document.getElementById('unlock-wallet-modal')).hide();

    if (unlocked) {
      this.notificationService.sendSuccess(`Wallet unlocked`);
    } else {
      this.notificationService.sendError(`Unable to unlock wallet`);
    }
  }

}
