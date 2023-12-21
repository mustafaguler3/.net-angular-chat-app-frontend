import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from '../services/members.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit{

  model: any = {}
  //currentUser$: Observable<User | null> = of(null);

  constructor(public accountService: AccountService,
              public memberService: MembersService,
              private router: Router,
              private toastService: ToastrService){}

  ngOnInit(): void {
     // this.currentUser$ = this.accountService.userSource$;
  }

  login(){
    this.accountService.login(this.model).subscribe({
      next: _ => this.router.navigateByUrl("/members"),
      error: err => this.toastService.error(err.error)
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl("/")
  }
}
