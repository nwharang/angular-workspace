import { Component } from '@angular/core';

@Component({
  selector: 'app-project',
  template: `
    <div class="container-fluid row" style="min-height: calc(100vh - 65px);">
      <div class="col-3  pe-3 py-3 ">
        <div class="border-end shadow rounded-3 h-100 p-3">
          <h3>Member</h3>
          <div class="">
            <h5>member1</h5>
            <p>email</p>
          </div>
          <div class=""></div>
        </div>
      </div>

      <div class="col-9 p-3">
        <div class=" shadow rounded-3 h-100 d-flex flex-column p-3">
          <h3>Task</h3>
          <div class="row flex-grow-1">
            <div class="col-4 border-end" dropzone="true">
              <h4>{{ 'Backlog' | translate }}</h4>
              <div class="card" draggable="true">
                <div class="card-body">card body</div>
              </div>
            </div>
            <div
              class="col-4 border-end"
              (dragover)="onDragOver($event)"
              (drop)="drop()"
            >
              <h4>Doing</h4>
              <div class="card">
                <div class="card-body">card body</div>
              </div>
            </div>
            <div class="col-4">
              <h4>Done</h4>
              <div class="card">
                <div class="card-body">card body</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProjectComponent {
  drop() {
    console.log('drag');
  }
  onDragOver(event: Event) {
    event.preventDefault();
  }
}
