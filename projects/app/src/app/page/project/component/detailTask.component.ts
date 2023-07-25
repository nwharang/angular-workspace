import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Status, Task } from '@prisma/client';
import {
  MemberService,
  MemberWithUser,
} from '~app/src/app/services/member.service';
import { trpc } from '~app/src/trpcClient';

//bootstrap modal
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
declare var bootstrap: any;
@Component({
  selector: 'app-detailTask',
  styles: [
    `
      .modal.show {
        display: flex !important;
        .modal-container {
          display: flex;
          max-width: 1000px;
          max-height: 800px;
          width: 100%;
          flex-flow: column wrap;
          flex: 1 0 auto;
        }
        .modal-content {
          flex: 1 0 auto;
        }
      }
    `,
  ],
  template: `
    <!-- Modal -->
    <div
      class="modal fade"
      id="modalTask"
      tabindex="-1"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-container">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-4 fw-bold" id="ModalLabel">
              <i class="fa-solid fa-tablet-screen-button"></i>
              {{ TaskDetail.name }}
              <br />
              <span class="fs-6">in </span
              ><span class="badge bg-primary me-3"
                >{{ TaskDetail.status }}
              </span>
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row justify-content-center h-100 g-2">
              <form
                class="col-9 border-end h-100"
                #frmUpdate="ngForm"
                (ngSubmit)="updateTask()"
              >
                <dl class="row ps-3 pt-3">
                  <dt class=" col-sm-3 fw-bold fw-1 me-2">
                    {{ 'TaskName' | translate }}:
                  </dt>
                  <dd class="col-sm-8">
                    <input
                      type="text"
                      class=" w-auto border rounded py-2 px-3"
                      name="name"
                      [(ngModel)]="TaskDetail.name"
                      [value]="TaskDetail.name"
                      [disabled]="updateInput"
                    />
                  </dd>
                  <dt class="col-sm-3  fw-bold me-2">
                    {{ 'TaskStartDate' | translate }} :
                  </dt>
                  <dd class="col-sm-8 ">
                    <input
                      type="date"
                      class="py-2 px-3 border rounded"
                      name="eff"
                      [valueAsDate]="TaskDetail.effDate"
                      disabled
                    />
                  </dd>
                  <dt class=" col-sm-3  fw-bold me-2">
                    {{ 'TaskEndDate' | translate }} :
                  </dt>
                  <dd class=" col-sm-8 ">
                    <input
                      type="date"
                      class="py-2 px-3 border rounded"
                      #endDate
                      name="endDate"
                      [disabled]="updateInput"
                      [valueAsDate]="TaskDetail.endDate"
                      (change)="onChangeHandler(endDate)"
                    />
                  </dd>
                  <dt class="col-sm-3 me-2">
                    <span class="fw-bold"
                      >{{ 'TaskStatus' | translate }} :</span
                    >
                  </dt>
                  <dd class="col-sm-8">
                    <select
                      class="form-select w-auto me-2"
                      name="status"
                      [(ngModel)]="TaskDetail.status"
                      [value]="TaskDetail.status"
                      [disabled]="updateInput"
                    >
                      <option value="InProgress">
                        {{ 'InProgress' | translate }}
                      </option>
                      <option value="Backlog">
                        {{ 'Backlog' | translate }}
                      </option>
                      <option value="Completed">
                        {{ 'Completed' | translate }}
                      </option>
                    </select>
                  </dd>
                  <dt class="col-sm-3 me-2">
                    <span class="fw-bold">
                      {{ 'TaskAssignee' | translate }} :
                    </span>
                  </dt>
                  <dd class="col-sm-8">
                    <select
                      class="form-select w-auto"
                      name="memberId"
                      placeholder="Task name"
                      [(ngModel)]="TaskDetail.memberId"
                      [value]="TaskDetail.memberId"
                      [disabled]="updateInput"
                    >
                      <option *ngFor="let item of memberList" [value]="item.id">
                        {{ item.User!.name }}
                      </option>
                    </select>
                  </dd>
                  <div class="d-flex">
                    <dt>
                      <span class="fst-italic fw-lighter"
                        >{{ 'TaskCreatedDate' | translate }}:</span
                      >
                    </dt>
                    <dd class="px-3">
                      <span class="badge bg-secondary ">
                        {{ TaskDetail.createdAt | date : 'dd/MM/yyyy' }}
                      </span>
                    </dd>
                    <dt>
                      <span class="fst-italic fw-lighter"
                        >{{ 'TaskUpdatedDate' | translate }}:</span
                      >
                    </dt>
                    <dd class="px-3">
                      <span class="badge bg-secondary ">
                        {{ TaskDetail.updatedAt | date : 'dd/MM/yyyy' }}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div>
                  <label class="fs-4 fw-bold">
                    <i
                      class="fa-solid fa-audio-description"
                      style="color: #2a436f;"
                    ></i>
                    {{ 'TaskDescription' | translate }} :
                  </label>
                  <textarea
                    class=" form-control "
                    [disabled]="updateInput"
                    name="description"
                    [(ngModel)]="TaskDetail.description"
                    [value]="TaskDetail.description"
                  >
                  </textarea>
                </div>
                <div *ngIf="!updateInput">
                  <button
                    style="submit"
                    class="btn btn-info"
                    (ngSubmit)="updateTask()"
                  >
                    {{ 'Save' | translate }}
                  </button>
                </div>
              </form>
              <div class="col-3">
                <h3>{{ 'Action' | translate }}</h3>
                <div class="d-flex flex-column">
                  <button
                    class="btn btn-primary me-2 me mb-3 flex-grow-1"
                    (click)="update()"
                  >
                    <i class="fa-solid fa-edit " style="color: #ffffff;"></i>
                    {{ 'Update' | translate }}
                  </button>
                  <button
                    class="btn btn-danger me-2 me mb-3 flex-grow-1"
                    (click)="deleteTask(TaskDetail!.id, 'delete')"
                  >
                    <i
                      class="fa-solid fa-trash-can"
                      style="color: #ffffff;"
                    ></i>
                    {{ 'Delete' | translate }}
                  </button>
                  <button
                    class="btn btn-success flex-grow-1"
                    (click)="moveTask()"
                  >
                    <i
                      class="fa-solid fa-angles-right"
                      style="color: #ffffff;"
                    ></i>
                    {{ updateStatus(TaskDetail.status) | translate }}
                  </button>
                  <div
                    *ngIf="error && showMessage"
                    class="alert alert-danger"
                    role="alert"
                  >
                    <h5 class="alert-heading">{{ error }}</h5>
                  </div>
                  <div
                    *ngIf="message && showMessage"
                    class="alert alert-success"
                    role="alert"
                  >
                    <h5 class="alert-heading">{{ message }}</h5>
                  </div>

                  <div *ngIf="isoke">
                    <h5 class="mt-3 mb-3">
                      Bạn có chắc muốn xóa {{ TaskDetail.name }}
                    </h5>
                    <button
                      type="button"
                      class="btn btn-danger me-3"
                      (click)="deleteTask(TaskDetail!.id, 'yes')"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary "
                      (click)="deleteTask(TaskDetail!.id, 'no')"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DetailTaskComponent {
  @Input() TaskDetail: Task = {} as Task;
  memberList: MemberWithUser[] = [];
  isOwner: boolean = false;
  isoke = false;
  error: [string] | null = null;
  message: [string] | null = null;
  projectId: string;
  updateInput: boolean = true;
  move: string = 'Move';
  showMessage: boolean = false;
  @Output() changeTaskList = new EventEmitter();
  constructor(
    private router: ActivatedRoute,
    private memberService: MemberService
  ) {
    this.projectId = this.router.snapshot.paramMap.get('id') as string;
    this.memberService
      .load(this.projectId)
      .then((data) => (this.memberList = data));
  }

  filterMemberList(id: unknown) {
    for (const member of this.memberList) {
      if (member.id == id) {
        return member.User?.name;
      }
    }
    return 'Not Found';
  }

  async deleteTask(id: string, isoke: string) {
    this.isoke = true;
    if (isoke == 'no') {
      this.isoke = false;
      return;
    } else if (isoke == 'yes') {
      await trpc.task.deleteTask
        .mutate({ id })
        .then(() => {
          this.error = null;
          this.message = ['Delete Success'];
          this.changeTaskList.emit();
          this.isoke = false;
          setTimeout(this.closeModal, 1000);
        })
        .catch((err) => {
          this.error = err;
          this.isoke = false;
          this.message = null;
        });
    }
  }

  async updateTask() {
    await trpc.task.updateTask
      .mutate({
        id: this.TaskDetail.id,
        name: this.TaskDetail.name,
        description: this.TaskDetail.description!,
        status: this.TaskDetail.status,
        endDate: new Date(this.TaskDetail.endDate),
        memberId: this.TaskDetail.memberId,
        projectId: this.projectId,
      })
      .then(() => {
        this.error = null;
        this.message = ['Update Success'];
        this.changeTaskList.emit(this.message);
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 2000);
      })
      .catch((err) => {
        this.error = err;
        this.message = null;
      });
    this.updateInput = !this.updateInput;
  }
  closeModal(id: string = 'modalTask') {
    this.error = null;
    this.message = null;
    const eleModal = document.getElementById(id);
    if (eleModal) {
      let myModal = bootstrap.Modal.getInstance(eleModal);
      if (!myModal) {
        myModal = new bootstrap.Modal(eleModal, {});
      }
      myModal.hide();
    }
  }
  async update() {
    this.TaskDetail.id = this.TaskDetail.id as string;
    this.TaskDetail.name = this.TaskDetail.name as string;
    this.updateInput = !this.updateInput;
    this.TaskDetail.memberId = this.TaskDetail.memberId as string;
    this.TaskDetail.description = this.TaskDetail.description as string;
    this.TaskDetail.status = this.TaskDetail.status as Status;
    this.TaskDetail.endDate = this.TaskDetail.endDate as Date;
  }

  async moveTask() {
    this.update();
    switch (this.TaskDetail.status) {
      case Status.Backlog:
        this.TaskDetail.status = Status.InProgress;
        this.updateTask();
        break;
      case Status.InProgress:
        this.TaskDetail.status = Status.Completed;
        this.move = 'Completed';
        this.updateTask();
        break;
      case Status.Completed:
        this.move = 'Done';
        this.deleteTask(this.TaskDetail.id, 'delete');
    }
  }

  updateStatus(status: unknown) {
    switch (status) {
      case Status.Backlog:
        return (this.move = 'InProgress');
      case Status.InProgress:
        return (this.move = 'Completed');
      case Status.Completed:
        return (this.move = 'Done');
    }
    return this.move;
  }

  onChangeHandler(e: HTMLInputElement) {
    this.TaskDetail.endDate=new Date(e.value)
  }
}
