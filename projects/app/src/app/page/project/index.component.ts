import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Prisma } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MemberWithUser = Prisma.validator<Prisma.MemberArgs>()({
  include: { User: true },
});
export type MemberWithUser = Prisma.MemberGetPayload<typeof MemberWithUser>;

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

  constructor(private router: ActivatedRoute) {
    this.projectId = this.router.snapshot.paramMap.get('id') as string;

    trpc.project.getMember
      .query({
        projectId: this.projectId,
      })
      .then((res) => {
        this.memberList = res as unknown as MemberWithUser[];
      });

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
