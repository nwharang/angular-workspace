import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Status } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';
import {
  MemberService,
  MemberWithUser,
} from '~app/src/app/services/member.service';

//bootstrap modal
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
declare var bootstrap: any;

@Component({
  selector: 'app-newtask',
  styles: [``],
  template: `
    <!-- Modal -->
    <div
      class="modal fade"
      id="modalNewTask"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">New Task</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form #frm="ngForm" (ngSubmit)="createNewTask($event, frm)">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  name="name"
                  placeholder="Task name"
                  [(ngModel)]="data.name"
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  class="form-control"
                  name="description"
                  rows="3"
                  placeholder="Task description"
                  [(ngModel)]="data.description"
                ></textarea>
              </div>

              <div class="mb-3">
                <label for="name" class="form-label">Member</label>
                <select
                  class="form-control"
                  name="memberId"
                  placeholder="Task name"
                  [(ngModel)]="data.memberId"
                >
                  <option *ngFor="let item of memberList" [value]="item.id">
                    {{ item.User!.name }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label for="endDate" class="form-label">End Date</label>
                <input
                  type="date"
                  class="form-control"
                  name="endDate"
                  placeholder="Task name"
                  [(ngModel)]="data.endDate"
                />
              </div>
              <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select
                  class="form-select"
                  name="status"
                  [(ngModel)]="data.status"
                >
                  <option value="Backlog" [defaultSelected]="data.status">
                    Backlog
                  </option>
                  <option value="InProgress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div *ngIf="showError">
                <div *ngIf="error" class="alert alert-danger" role="alert">
                  <p class="alert-heading">{{ error }}</p>
                </div>
              </div>
              <div *ngIf="showMessage">
                <div *ngIf="message" class="alert alert-success" role="alert">
                  <p class="alert-heading">{{ message }}</p>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">Create</button>
            </form>
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
export class NewTaskComponent {
  error: [string, string] | null = null;
  message: [string] | null = null;
  projectid: string;
  showMessage = false;
  showError = false;
  @Output() changeTaskList = new EventEmitter();
  data: {
    memberId: string;
    name: string;
    description: string;
    status: Status;
    effDate: Date;
    endDate: Date;
  } = {
    memberId: '',
    name: '',
    description: '',
    status: Status.Backlog,
    effDate: new Date(),
    endDate: new Date(),
  };
  memberList: MemberWithUser[] = [];
  constructor(roure: ActivatedRoute, private memberService: MemberService) {
    this.projectid = roure.snapshot.paramMap.get('id')!;

    this.memberService
      .load(this.projectid)
      .then((data) => (this.memberList = data));
  }
  async createNewTask(e: Event, frm: NgForm) {
    e.preventDefault();
    if (frm.valid) {
      await trpc.task.createTask
        .mutate({
          name: this.data.name,
          description: this.data.description,
          status: this.data.status,
          endDate: new Date(this.data.endDate),
          memberId: this.data.memberId,
          projectId: this.projectid,
        })
        .then(() => {
          this.showMessage = true;
          this.message = [`Create task ${this.data.name} success`];
          this.error = null;
          this.changeTaskList.emit();
          setTimeout(this.closeModal, 1000);
          setTimeout(() => {
            this.showMessage = false;
          }, 2000);
        })
        .catch((err) => {
          this.showError = true;
          this.error = err;
          this.message = null;
          setTimeout(() => {
            this.showError = false;
          }, 2000);
        });
    }
    frm.reset();
  }

  closeModal(id: string = 'modalNewTask') {
    const eleModal = document.getElementById(id);
    if (eleModal) {
      let myModal = bootstrap.Modal.getInstance(eleModal);
      if (!myModal) {
        myModal = new bootstrap.Modal(eleModal, {});
      }

      myModal.hide();
    }
  }
}
