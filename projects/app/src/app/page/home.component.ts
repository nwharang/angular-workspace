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
  template: `
    <div
      class="container row mx-auto h-100"
      style="min-height: calc(100vh - 66px);"
    >
      <div class="col-8 py-3">
        <div class="p-3 shadow rounded-3">
          <div class="d-flex justify-content-between pb-3">
            <h3>{{ 'Project' | translate }}</h3>
            <button class="btn btn-primary">{{ 'Create Project' }}</button>
          </div>
          <div *ngIf="projectList.length == 0">
            {{ 'MessageProjectHomePage' | translate }}
          </div>
          <div class="row">
            <div *ngFor="let item of projectList" class="col-6">
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
        </div>
      </div>
      <div class="col-4 py-3">
        <div class="p-3 shadow rounded-3 row ">
          <h3>{{ 'Invitation' | translate }}</h3>
          <p>{{ 'InvitationDescription' | translate }}</p>
          <div *ngIf="memberList.length == 0">
            {{ 'MessageMemberHomePage' | translate }}
          </div>
          <div *ngFor="let item of memberList">
            <div
              class="card text-start cardItem"
              [routerLink]="['/project', item.id]"
            >
              <div class="card-body row">
                <div class="col-8">
                  <h4 class="card-title">{{ item.Project?.name }}</h4>
                  <p class="card-text">{{ item.Project?.description }}</p>
                </div>
                <div class="col-4" style="max-width: 120px;">
                  <button
                    class="btn btn-success mb-3 w-100"
                    (click)="handlerInvitaion(item.projectId!, 'Accepted')"
                  >
                    {{ 'Accept' | translate }}
                  </button>
                  <button
                    class="btn btn-danger w-100"
                    (click)="handlerInvitaion(item.projectId!, 'Rejected')"
                  >
                    {{ 'Reject' | translate }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  memberList: MemberWithProject[] = [];
  projectList: Project[] = [];
  showCreateProject = false;
  error: string | null = null;
  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    if (!(await this.authService.isAuth)) return;
    this.loadProject();
    this.loadMemberList();
  }
  async loadProject() {
    this.projectList =
      (await trpc.project.list.query()) as unknown as Project[];
  }
  async loadMemberList() {
    this.memberList =
      (await trpc.member.list.query()) as unknown as MemberWithProject[];
  }
  async handlerInvitaion(
    projectId: string,
    data: InvitationStatus
  ): Promise<void> {
    const res = (await trpc.member.invitation.mutate({
      projectId,
      status: data,
    })) as unknown as MemberWithProject[];
    this.memberList = res;
    this.loadProject();
  }
}
