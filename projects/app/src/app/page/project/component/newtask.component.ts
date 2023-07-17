import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Status } from '@prisma/client';
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
      <form
        #frm="ngForm"
        (ngSubmit)="createNewTask($event, frm)"
        class="modal-dialog"
      >
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
            <div>
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
                <label for="effDate" class="form-label">Effort Date</label>
                <input
                  type="date"
                  class="form-control"
                  name="effDate"
                  placeholder="Task name"
                  [(ngModel)]="data.effDate"
                />
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
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class NewTaskComponent {
  @Output() newTask = new EventEmitter();
  data: {
    name: string;
    description: string | null;
    status: Status;
    effDate: Date;
    endDate: Date;
  } = {
    name: '',
    description: null,
    status: Status.Backlog,
    effDate: new Date(),
    endDate: new Date(),
  };
  // <{
  //   name: string;
  //   description: string | null;
  //   status: Status;
  //   effDate: Date;
  //   endDate: Date;
  // }>
  createNewTask(e: Event, frm: NgForm) {
    e.preventDefault();

    console.log(frm);
  }
}
