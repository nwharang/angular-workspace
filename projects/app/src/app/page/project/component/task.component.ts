import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';
import { MemberWithUser } from '../index.component';

@Component({
  selector: 'app-task',
  template: `
    <div class=" shadow rounded-3 h-100 d-flex flex-column p-3">
      <div class="d-flex justify-content-between">
        <h2>Task</h2>
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
          class="col-4 border-2  border-end overflow-y-auto"
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
                <i class="fa-solid fa-arrow-right" style="color: #0a0a0a;"></i>
                2021-09-29
              </p>
            </div>
          </div>
        </div>

        <div
          class="col-4 border-2 border-end"
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
                <i class="fa-solid fa-arrow-right" style="color: #0a0a0a;"></i>
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
                <i class="fa-solid fa-arrow-right" style="color: #0a0a0a;"></i>
                2021-09-29
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-newtask (newTask)="handlerCreateTask($event)" />
    <app-detailTask
      (deteleTask)="handlerDeleteTask($event)"
      (updateTask)="handlerUpdateTask($event)"
    />
  `,
})
export class TaskComponent {
  @HostBinding('class') class = 'col-9 p-3';
  @Input() memberList: MemberWithUser[] = [];

  drag: Task | null = null;
  taskList: Task[] = [];
  projectId;

  constructor(private router: ActivatedRoute) {
    this.projectId = this.router.snapshot.paramMap.get('id') as string;
    trpc.task.getTaskByProjectId
      .query({ projectId: this.projectId })
      .then((res) => {
        this.taskList = res as unknown as Task[];
      });
  }
  drop(e: Event, target?: HTMLElement) {
    e.preventDefault();
    console.log(target);
  }
  onDragOver(event: Event) {
    event.preventDefault();
  }

  onDrag(task: Task | null) {
    this.drag = task;
  }

  handlerCreateTask(e: Event) {
    console.log(e);
  }
  handlerUpdateTask(e: Event) {
    console.log(e);
  }
  handlerDeleteTask(e: Event) {
    console.log(e);
  }
}
