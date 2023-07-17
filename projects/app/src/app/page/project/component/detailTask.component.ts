import { Component } from '@angular/core';

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
              <i class="fa-solid fa-tablet-screen-button"></i> Modal title
              <br />
              <span class="fs-6">in </span
              ><span class="badge bg-primary me-3"> Backlog </span>
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
              <div class="col-9 border-end h-100">
                <div class="d-flex flex-wrap ps-3">
                  <div class="d-flex">
                    <label class="form-label me-3 fw-bold">Start Date :</label>
                    <input
                      class="form-control me-5"
                      type="date"
                      value="2011-08-19"
                      style="width: max-content;"
                    />
                  </div>
                  <div class="d-flex">
                    <label class="form-label me-3 fw-bold">End Date :</label>
                    <input
                      class="form-control "
                      type="date"
                      value="2011-09-29"
                      style="width: max-content;"
                    />
                  </div>
                </div>
                <dl class="row ps-3 pt-3">
                  <dt class="col-sm-2">
                    <span class="fw-bold">Status :</span>
                  </dt>
                  <dd class="col-sm-9">
                    <span class="badge bg-primary">Backlog</span>
                  </dd>
                  <dt class="col-sm-2">
                    <span class="fw-bold">Member :</span>
                  </dt>
                  <dd class="col-sm-9">
                    <span class="badge bg-primary">admin</span>
                  </dd>
                  <dt class="col-sm-2">
                    <span class="fw-bold">Create date :</span>
                  </dt>
                  <dd class="col-sm-9">
                    <span class="badge bg-secondary ">26/01/25 </span>
                  </dd>
                  <dt class="col-sm-2">
                    <span class="fw-bold">Updatedate :</span>
                  </dt>
                  <dd class="col-sm-9">
                    <span class="badge bg-secondary ">26/01/25</span>
                  </dd>
                </dl>

                <div>
                  <h4 class="fs-4 fw-bold">
                    <i
                      class="fa-solid fa-audio-description"
                      style="color: #2a436f;"
                    ></i>
                    Description :
                  </h4>
                  <p class="ps-3">
                    Lorem ipsum dolor sit am >et consectetur adipisicing elit. A
                    dignissimos vitae ea doloribus, animi praesentium quidem
                    adipisci culpa odio minus!
                  </p>
                </div>
              </div>
              <div class="col-3">
                <h3>Action</h3>
                <div class="d-flex flex-wrap">
                  <button class="btn btn-primary me-2 me mb-3 flex-grow-1">
                    <i class="fa-solid fa-edit " style="color: #ffffff;"></i>
                    Update
                  </button>
                  <button class="btn btn-danger me-2 me mb-3 flex-grow-1">
                    <i
                      class="fa-solid fa-trash-can"
                      style="color: #ffffff;"
                    ></i>
                    Delete
                  </button>
                  <button class="btn btn-success flex-grow-1">
                    <i
                      class="fa-solid fa-angles-right"
                      style="color: #ffffff;"
                    ></i>
                    Move
                  </button>
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
  constructor() {}
}
