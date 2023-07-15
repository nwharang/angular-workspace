import { Component, OnInit } from '@angular/core';
import { InvitationStatus, Prisma, Project } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';
import { AuthService } from '../services/auth.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MemberWithProject = Prisma.validator<Prisma.MemberArgs>()({
  include: { Project: true },
});
type MemberWithProject = Prisma.MemberGetPayload<typeof MemberWithProject>;

@Component({
  selector: 'app-info',
  styles: [
    `
      .cardItem {
        :hover {
          background-color: #e9ecef;
          cursor: pointer;
        }
      }
    `,
  ],
  template: ` <div
    class="container row mx-auto shadow"
    style="min-height: calc(100vh - 65px);"
  >
    <div class="col-8 pt-3">
      <h3>{{ 'Project' | translate }}</h3>
      <div *ngIf="projectList.length == 0">
        {{ 'MessageProjectHomePage' | translate }}
      </div>
      <div *ngFor="let item of projectList">
        <div
          class="card text-start cardItem"
          [routerLink]="['/project', item.id]"
        >
          <div class="card-body">
            <h4 class="card-title">{{ item.name }}</h4>
            <p class="card-text">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col-4 border-start pt-3">
      <h3>{{ 'Invitation' | translate }}</h3>
      <div *ngIf="memberList.length == 0">
        {{ 'MessageMemberHomePage' | translate }}
      </div>
      <div class="d-flex " *ngFor="let item of memberList">
        Lời mời vào nhóm: {{ item.Project?.name }}
        <button
          class="btn btn-outline-success"
          (click)="handlerInvitaion(item.projectId!, 'Accepted')"
        >
          {{ 'Accept' | translate }}
        </button>
        <button
          class="btn btn-outline-danger"
          (click)="handlerInvitaion(item.projectId!, 'Rejected')"
        >
          {{ 'Reject' | translate }}
        </button>
      </div>
    </div>
  </div>`,
})
export class HomeComponent implements OnInit {
  memberList: MemberWithProject[] = [];
  projectList: Project[] = [];
  error: string | null = null;
  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    if (!(await this.authService.isAuth)) return;
    trpc.project.list.query().then(({ data }) => {
      this.projectList = data as unknown as Project[];
    });
    trpc.member.list.query().then(({ data }) => {
      this.memberList = data as unknown as MemberWithProject[];
    });
    // trpc.project.addMember.mutate({
    //   projectId: '64abcad86bd864f76c62cb91',
    //   email: 'example1@example.com',
    // });
  }
  async handlerInvitaion(
    projectId: string,
    data: InvitationStatus
  ): Promise<void> {
    const res = (await trpc.member.invitation.mutate({
      projectId,
      status: data,
    })) as unknown as { data: MemberWithProject[] };
    this.memberList = res.data;
    trpc.project.list.query().then(({ data }) => {
      this.projectList = data as unknown as Project[];
    });
  }
}
