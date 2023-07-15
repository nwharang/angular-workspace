import { Component, OnInit } from '@angular/core';
import { Member, Project } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-info',
  template: ` <div>
    <div>{{ 'Home' | translate }}</div>
    <div *ngFor="let item of projectList">ProjectId : {{ item.id }}</div>
    <div *ngFor="let item of memberList">MemberId : {{ item.id }}</div>
  </div>`,
})
export class HomeComponent implements OnInit {
  memberList: Member[] = [];
  projectList: Project[] = [];
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isAuth) return;
    trpc.project.list.query().then(({ data }) => {
      this.projectList = data as unknown as Project[];
    });
    trpc.member.list.query().then(({ data }) => {
      this.memberList = data as unknown as Member[];
    });
    trpc.project.addMember.mutate({
      projectId: '64abcad86bd864f76c62cb91',
      email: 'example1@example.com',
    });
  }
}
