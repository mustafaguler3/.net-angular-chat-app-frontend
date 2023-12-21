import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'dating-app';
  users: any

  constructor(private http: HttpClient,
              private accountService: AccountService){}
  
  ngOnInit(): void {
      this.setCurrentUser();
  }

  setCurrentUser(){
    const userString = localStorage.getItem("user")
    if(!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user)
  }

}
