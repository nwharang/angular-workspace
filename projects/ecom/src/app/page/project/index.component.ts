import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trpc } from '~ecom/src/trpcClient';
import { MemberService, MemberWithUser } from '../../services/member.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

@Component({
  selector: 'app-project',
  styles: [
    `
      .card {
        background-color: #ffffff;
        &:hover {
          background-color: #f0f0f0;
        }
      }
    `,
  ],
  template: `
    <div class="container-fluid row" style="min-height: calc(100vh - 65px);">
      <app-member
        [memberList]="memberList"
        [isOwner]="isOwner"
        [projectId]="projectId"
        (changeMemberList)="handlerChangeMemberList()"
      />
      <app-task [memberList]="memberList" />
    </div>
  `,
})
export class ProjectComponent {
  memberList: MemberWithUser[] = [];
  isOwner: boolean = false;
  projectId: string;

  constructor(
    private router: ActivatedRoute,
    private memberService: MemberService
  ) {
    this.projectId = this.router.snapshot.paramMap.get('id') as string;

    this.memberService
      .load(this.projectId)
      .then((data) => (this.memberList = data));
    trpc.project.isOwner.query({ projectId: this.projectId }).then((res) => {
      this.isOwner = res as boolean;
    });
  }

  handlerChangeMemberList() {
    trpc.project.getMember
      .query({
        projectId: this.projectId,
      })
      .then((res) => {
        this.memberList = res as unknown as MemberWithUser[];
      });
  }
  

  //selectedMember
}
