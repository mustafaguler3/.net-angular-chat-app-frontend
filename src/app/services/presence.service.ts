import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([])
  onlineUsersSource$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService,
              private router: Router) { }

  createHubConnection(user:User){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + "presence",{
      accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start().catch(err => console.log(err));

    this.hubConnection.on("UserIsOnline",username => {
      this.onlineUsersSource$.pipe(take(1)).subscribe({
        next: usernames => this.onlineUsersSource.next([...usernames,username])
      })
    })

    this.hubConnection.on("UserIsOffline",username => {
      this.onlineUsersSource$.pipe(take(1)).subscribe({
        next: usernames => this.onlineUsersSource.next(usernames.filter(x => x !== username))
      })
    })

    this.hubConnection.on("GetOnlineUsers",username => {
      this.onlineUsersSource.next(username)
    });

    this.hubConnection.on("NewMessageReceived",({username,knownAs}) => {
      this.toastr.info(knownAs + ' has sent you a new message! click me to see it')
      .onTap
      .pipe(take(1))
      .subscribe({
        next: () => this.router.navigateByUrl("/members/"+username + "?tab=Message")
      })
    })
  }
  stopHubConnection(){
    this.hubConnection?.stop().catch(err => console.log(err))
  }
}
