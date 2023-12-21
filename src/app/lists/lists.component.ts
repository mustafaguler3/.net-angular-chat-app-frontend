import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { MembersService } from '../services/members.service';
import { Pagination } from '../models/pagination';
import { UserParams } from '../models/userParams';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit{
  members: Member[]
  predicate = "liked";
  pageNumber = 1;
  pageSize = 5;
  userParams:UserParams
  pagination: Pagination | undefined

  constructor(private memberService: MembersService){}

  ngOnInit(): void {
    this.loadLikes()
  }

  loadLikes(){
    this.memberService.getLikes(this.predicate,this.pageNumber,this.pageSize).subscribe({
      next: response => {
        this.members = response?.result
        this.pagination = response?.pagination
      },
      error : err => console.log(err)
    })
  }

  pageChanged(event: any){
    if(this.pageNumber !== event.page){
      this.pageNumber = event.page;
      this.loadLikes()
    }
  }
}
