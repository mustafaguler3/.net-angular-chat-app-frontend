import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl
  private userSource = new BehaviorSubject<User | null>(null);
  userSource$ = this.userSource.asObservable();

  constructor(private http: HttpClient,
              private presenceService: PresenceService) { }

  login(model: any){
    return this.http.post<User>(this.baseUrl +"account/login",model).pipe(
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user)
        }
      })
    )
  }
  register(model: any){
    return this.http.post<User>(this.baseUrl +"account/register",model).pipe(
      map( user => {
        if(user){
          this.setCurrentUser(user)
        }
      })
    )
  }
  setCurrentUser(user: User){
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    
    localStorage.setItem("user",JSON.stringify(user))
    this.userSource.next(user)
    this.presenceService.createHubConnection(user)
  }

  logout(){
    localStorage.removeItem("user")
    this.userSource.next(null)
    this.presenceService.stopHubConnection()
  }

  getDecodedToken(token: string){
    return JSON.parse(atob(token.split(".")[1]))
  }

}
