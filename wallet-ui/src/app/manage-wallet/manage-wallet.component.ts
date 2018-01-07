import { Component, OnInit } from '@angular/core';
import {WalletService} from "../wallet.service";
import {NotificationService} from "../notification.service";

@Component({
  selector: 'app-manage-wallet',
  templateUrl: './manage-wallet.component.html',
  styleUrls: ['./manage-wallet.component.css']
})
export class ManageWalletComponent implements OnInit {

  wallet = this.walletService.wallet;

  newPassword = '';
  confirmPassword = '';
  unlockPassword = '';

  constructor(private walletService: WalletService, private notificationService: NotificationService) { }

  async ngOnInit() {
    this.wallet = this.walletService.wallet;
  }

  async changePassword() {
    if (this.newPassword !== this.confirmPassword) return;

    const updated = await this.walletService.walletApi.walletPasswordChange(this.wallet.id, this.newPassword);

    const success = updated.changed === '1';
    this.newPassword = '';
    this.confirmPassword = '';
    if (success) {
      this.notificationService.sendSuccess(`Wallet password successfully updated`);
    } else {
      this.notificationService.sendError(`Unable to change wallet password`);
    }
  }

  async backupWallet() {
    const backup = await this.walletService.walletApi.walletExport(this.wallet.id);
    const backupData = JSON.parse(backup.json);
    console.log(backupData);
  }

}
