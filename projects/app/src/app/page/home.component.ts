import { Component, OnInit } from '@angular/core';
import { InvitationStatus, Prisma, Project } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';
import { AuthService } from '../services/auth.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, no-var
declare var bootstrap: any;
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
          <div class="d-flex justify-content-between py-2">
            <h3>{{ 'Project' | translate }}</h3>
            <button
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalNewProject"
            >
              {{ 'CreateProject' | translate }}
            </button>
          </div>
          <div *ngIf="projectList.length == 0">
            {{ 'MessageProjectHomePage' | translate }}
          </div>
          <div class="row">
            <div
              *ngFor="let item of projectList"
              class="col-6 position-relative"
            >
              <button
                class="btn btn-danger position-absolute top-50 translate-middle "
                style="z-index: 500; right: 1rem;"
                (click)="deleteProject(item)"
              >
                <i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>
              </button>
              <div
                class="card text-start cardItem "
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
          <p>{{ 'InvitationMessage' | translate }}</p>
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
                  <h4 class="card-title">{{ item.Project.name }}</h4>
                  <p class="card-text">{{ item.Project.description }}</p>
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
    <!-- Modal project -->
    <form
      #frm="ngForm"
      (ngSubmit)="createNewProject($event)"
      class="modal fade"
      id="modalNewProject"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              {{ 'CreateProject' | translate }}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div>
              <div class="mb-3">
                <label for="name" class="form-label">
                  {{ 'NameProject' | translate }}</label
                >
                <input
                  type="text"
                  class="form-control"
                  required
                  name="name"
                  placeholder="Project name"
                  [(ngModel)]="data.name"
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">{{
                  'Description' | translate
                }}</label>
                <textarea
                  class="form-control"
                  name="description"
                  rows="10"
                  required
                  placeholder="Task description"
                  [(ngModel)]="data.description"
                ></textarea>
              </div>

              <div *ngIf="error" class="alert alert-danger" role="alert">
                <h4 class="alert-heading">{{ error }}</h4>
              </div>
              <div *ngIf="message" class="alert alert-success" role="alert">
                <h4 class="alert-heading">{{ message }}</h4>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">
              {{ 'Create' | translate }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {{ 'Close' | translate }}
            </button>
          </div>
        </div>
      </div>
    </form>
  `,
})
export class HomeComponent implements OnInit {
  memberList: MemberWithProject[] = [];
  projectList: Project[] = [];
  showCreateProject = false;
  error: string | null = null;
  message: string | null = null;
  data: { name: string; description: string } = {
    name: '',
    description: '',
  };

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
  async createNewProject(event: Event): Promise<void> {
    event.preventDefault();
    const res = await trpc.project.create.mutate({
      name: this.data.name,
      description: this.data.description,
    });
    if (res) this.loadProject();
    this.closeModal();
  }
  async deleteProject(item: Project): Promise<void> {
    const res = await trpc.project.delete.mutate({ id: item.id });
    if (res) this.loadProject();
  }
  closeModal(): void {
    const eleModal = document.getElementById('modalNewProject');
    if (eleModal) {
      let myModal = bootstrap.Modal.getInstance(eleModal);
      if (!myModal) {
        myModal = new bootstrap.Modal(eleModal, {});
      }

      myModal.hide();
    }
    this.data = {
      name: '',
      description: '',
    };
    this.error = null;
    this.message = null;
  }
}
