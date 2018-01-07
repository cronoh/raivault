import { Component, OnInit } from '@angular/core';
import {WalletService} from "../wallet.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  node = this.walletService.node;
  wallet = this.walletService.wallet;

  constructor(private walletService: WalletService) { }

  ngOnInit() {
  }

}
