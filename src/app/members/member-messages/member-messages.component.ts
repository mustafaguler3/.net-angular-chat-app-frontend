import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  standalone: true,
  styleUrls: ['./member-messages.component.scss'],
  imports:[CommonModule,TimeagoModule,FormsModule]
})
export class MemberMessagesComponent implements OnInit{
  @ViewChild("messageForm") messageForm?: NgForm
  @Input() username?: string
  messageContent = "";

  constructor(public messageService: MessageService){ 
  }

  ngOnInit(): void {
      //this.loadMessages()
  }

  sendMessage(){
    if(!this.username) return;
    this.messageService.sendMessage(this.username,this.messageContent).then(()=>{
      this.messageForm?.reset();
    });
  }
  
}
