import { Component } from '@angular/core';

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
            <form>
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  placeholder="Task name"
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  class="form-control"
                  id="description"
                  rows="3"
                  placeholder="Task description"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="effDate" class="form-label">Effort Date</label>
                <input
                  type="date"
                  class="form-control"
                  id="effDate"
                  placeholder="Task name"
                />
              </div>
              <div class="mb-3">
                <label for="endDate" class="form-label">End Date</label>
                <input
                  type="date"
                  class="form-control"
                  id="endDate"
                  placeholder="Task name"
                />
              </div>
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
            <button type="button" class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NewTaskComponent {}
