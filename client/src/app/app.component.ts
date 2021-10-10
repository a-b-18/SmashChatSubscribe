import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating app';
  users: any;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }

  skwar: boolean;
  user_input: string = "";

  setSkwar(user_input) {
    user_input = user_input.toUpperCase();
    if (user_input.match(/SK[^]*WA/)!=null) {
      this.skwar = true;
    } else {
      this.skwar = false;
    }
  }

}
