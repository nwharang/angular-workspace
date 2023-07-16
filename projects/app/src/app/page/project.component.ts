import { Component } from '@angular/core';
import { Member, Task } from '@prisma/client';

@Component({
  selector: 'app-project',
  styles: [
    `
      .member {
        background-color: #ffffff;
        border: 1px solid #000000;
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 10px;
        &:hover {
          background-color: #f0f0f0;
        }
        &:active {
          background-color: #cfe2ff;
        }
      }
    `,
  ],
  template: `
    <div class="container-fluid row" style="min-height: calc(100vh - 65px);">
      <div class="col-3  pe-3 py-3 ">
        <div class="border-end shadow rounded-3 h-100 p-3 ">
          <h2 class="">Project name</h2>
          <div class="d-flex justify-content-center my-4  ">
            <button
              class="btn btn-primary me-3"
              (click)="showAddMember = !showAddMember"
            >
              <i class="fa-solid fa-plus" style="color: #ffffff;"></i>
            </button>
            <button class="btn btn-info me-3">
              <i class="fa-solid fa-edit" style="color: #ffffff;"></i>
            </button>
            <button class="btn btn-danger">
              <i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>
            </button>
            <button class="btn btn-warning ms-3">
              <i
                class="fa-solid fa-arrow-right-from-bracket"
                style="color: #ffffff;"
              ></i>
            </button>
          </div>
          <div [class.d-none]="showAddMember">
            <h5 class="mb-2">Add member to project</h5>
            <form action="">
              <div class="input-group mb-3">
                <input
                  type="email"
                  class="form-control"
                  placeholder="email"
                  aria-label="email"
                  aria-describedby="basic-addon1"
                />
                <button class="btn btn-primary" type="submit">
                  <i class="fa-solid fa-plus" style="color: #ffffff;"></i>
                </button>
              </div>
            </form>
          </div>
          <h3
            class="block bg-dark-subtle bg-gradient  text-center rounded-3 py-1"
          >
            Member
          </h3>
          <div
            class="member"
            [class.active]="selectorMember"
            (click)="selectedMember()"
          >
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <img 
                  src="https://picsum.photos/200"
                  alt="member"
                  class="rounded-circle me-3"
                  style="width: 50px; height: 50px;"
                />
                <div>
                  <h5 class="mb-0">admin</h5>
                  <p class="mb-0">admin</p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="member"
            [class.active]="selectorMember"
            (click)="selectedMember()"
          >
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <img
                  src="https://picsum.photos/200"
                  alt="member"
                  class="rounded-circle me-3"
                  style="width: 50px; height: 50px;"
                />
                <div>
                  <h5 class="mb-0">admin</h5>
                  <p class="mb-0">admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-9 p-3">
        <div class=" shadow rounded-3 h-100 d-flex flex-column p-3">
          <div class="d-flex justify-content-between">
            <h3>Task</h3>
            <button
              class="btn btn-primary me-3"
              data-bs-toggle="modal"
              data-bs-target="#modalNewTask"
            >
              <i class="fa-solid fa-plus" style="color: #ffffff;"></i> New task
            </button>
          </div>
          <div class="row flex-grow-1">
            <div
              class="col-4 border-end overflow-y-auto"
              (dragover)="onDragOver($event)"
              (drop)="drop($event)"
            >
              <h4>{{ 'Backlog' | translate }}</h4>
              <div
                class="card"
                draggable="true"
                (dragstart)="onDrag(null)"
                (dragend)="onDrag(null)"
                data-bs-toggle="modal"
                data-bs-target="#modalTask"
              >
                <div class="card-body mb-3">
                  <h4>Task name</h4>
                  <p class="mb-0 fw-light ps-6">
                    <span class="badge bg-secondary">Date :</span> 2021-08-19
                    <i
                      class="fa-solid fa-arrow-right"
                      style="color: #0a0a0a;"
                    ></i>
                    2021-09-29
                  </p>
                </div>
              </div>
            </div>

            <div
              class="col-4 border-end"
              #doing
              (dragover)="onDragOver($event)"
              (drop)="drop($event, doing)"
            >
              <h4>Doing</h4>
              <div
                class="card"
                draggable="true"
                data-bs-toggle="modal"
                data-bs-target="#modalTask"
              >
                <div class="card-body mb-3">
                  <h4>Task name</h4>
                  <p class="mb-0 fw-light ps-6">
                    <span class="badge bg-secondary">Date :</span> 2021-08-19
                    <i
                      class="fa-solid fa-arrow-right"
                      style="color: #0a0a0a;"
                    ></i>
                    2021-09-29
                  </p>
                </div>
              </div>
            </div>

            <div
              class="col-4"
              (dragover)="onDragOver($event)"
              (drop)="drop($event)"
            >
              <h4>Done</h4>
              <div
                class="card"
                draggable="true"
                data-bs-toggle="modal"
                data-bs-target="#modalTask"
              >
                <div class="card-body mb-3">
                  <h4>Task name</h4>
                  <p class="mb-0 fw-light ps-6">
                    <span class="badge bg-secondary">Date :</span> 2021-08-19
                    <i
                      class="fa-solid fa-arrow-right"
                      style="color: #0a0a0a;"
                    ></i>
                    2021-09-29
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-newtask></app-newtask>
    <app-detailTask></app-detailTask>
  `,
})
export class ProjectComponent {
  showAddMember: boolean = true;
  selectorMember: boolean = false;
  drag: Task | null = null;
  memberList: Member[];
  taskList: Task[];
  constructor() {
    this.taskList = [];
    this.memberList = [];
  }
  drop(e: Event, target?: HTMLElement) {
    e.preventDefault();
    if (!this.drag) return;
    if (target) {
      target.appendChild(e.target as Node);
    }
    // Goi ve server la gui di dau
    // Load lai du lieu
    console.log(e);
  }
  onDragOver(event: Event) {
    event.preventDefault();
  }

  onDrag(task: Task | null) {
    this.drag = task;
  }
  //selectedMember
  selectedMember() {}
}
