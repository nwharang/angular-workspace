import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Status, Task } from '@prisma/client';
import { trpc } from '~app/src/trpcClient';
import {
  MemberService,
  MemberWithUser,
} from '~app/src/app/services/member.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const bootstrap: any;

@Component({
  selector: 'app-task',
  styles: [
    `
      .card {
        cursor: pointer;
        &:hover {
          background-color: #f0f0f0;
        }
      }
    `,
  ],

  template: `
    <div class=" shadow rounded-3 h-100 d-flex flex-column p-3">
      <div class="d-flex justify-content-between">
        <h2>{{ 'Tasks' | translate }}</h2>
        <button
          class="btn btn-primary me-3"
          (click)="openModal('modalNewTask')"
        >
          <i class="fa-solid fa-plus" style="color: #ffffff;"></i>
          {{ 'AddTask' | translate }}
        </button>
      </div>
      <div class="row flex-grow-1">
        <div
          *ngFor="let sStatus of taskStatus"
          class="col-4 border-2  border-end  "
          (dragover)="onDragOver($event)"
          (drop)="drop($event, sStatus)"
        >
          <h4>{{ sStatus | translate }}</h4>
          <div
            class="card mb-2"
            draggable="true"
            (dragstart)="onDrag(item)"
            (dragend)="onDrag(item)"
            (click)="openModal('modalTask', item)"
            #id
            *ngFor="let item of filterTask(sStatus)"
          >
            <div class="card-body mb-3">
              <h4>{{ item.name }}</h4>
              <p class="mb-0 fw-light fs-6">
                <span class="badge bg-secondary mt-2">Date :</span
                >{{ item.effDate | date : 'dd/MM/yyyy' }}
                <i class="fa-solid fa-arrow-right" style="color: #0a0a0a;"></i>
                {{ item.endDate | date : 'dd/MM/yyyy' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-newtask (changeTaskList)="handlerTask()" />
    <app-detailTask
      [TaskDetail]="TaskDetail"
      (changeTaskList)="handlerTask()"
    />
  `,
})
export class TaskComponent {
  @HostBinding('class') class = 'col-9 p-3';
  @Input() memberList: MemberWithUser[] = [];
  TaskDetail: Task ={}as Task;
  drag: Task | null = null;
  taskList: Task[] = [];
  showDetails = false;
  projectId;
  taskStatus: string[] = Object.keys(Status);
  constructor(
    private router: ActivatedRoute,
    private memberService: MemberService
  ) {
    this.projectId = this.router.snapshot.paramMap.get('id') as string;
    this.handlerTask();
  }
  async drop(e: Event, target: string) {
    e.preventDefault();
    if (this.drag) {
      await trpc.task.updateTask.mutate({
        ...this.drag,
        description: this.drag.description!,
        status: target as Status,
      });
    }
    await this.handlerTask();
  }
  onDragOver(event: Event) {
    event.preventDefault();
  }

  onDrag(task: Task | null) {
    this.drag = task;
  }
  filterTask(status: string) {
    return this.taskList.filter((e) => e.status == (status as Status));
  }

  handlerTask() {
    trpc.task.getTaskByProjectId
      .query({ projectId: this.projectId })
      .then((res) => {
        this.taskList = res as unknown as Task[];
      });
  }
  //function open bootstrap modal
  openModal(id: string, item: Task | null = null) {
    if (id == 'modalTask') {
      this.TaskDetail = item as unknown as Task;
    }
    const eleModal = document.getElementById(id);
    try {
      let myModal = bootstrap.Modal.getInstance(eleModal);
      if (!myModal) {
        myModal = new bootstrap.Modal(eleModal, {});
      }
      myModal.show();
    
    // eslint-disable-next-line no-empty
    } catch (error) {
      console.log(error);
    }
  }
}