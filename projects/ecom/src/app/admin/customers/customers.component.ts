import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customers',
  template: `
    <section>
      <div class="d-flex justify-content-between">
        <h1 class="text-warning">Customers</h1>
        <!-- Button trigger modal -->
        <button
          type="button"
          class="btn btn-outline-warning"
          data-bs-toggle="modal"
          data-bs-target="#addProduct"
        >
          Add User
        </button>

        <!-- Modal -->
        <div
          class="modal fade"
          id="addProduct"
          tabindex="-1"
          aria-labelledby="modalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog ">
            <form
              class="modal-content bg-dark"
              #frm="ngForm"
              (ngSubmit)="onSubmit(frm)"
            >
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalLabel">Add Product</h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label for="name" class="form-label">Email</label>
                  <input
                    type="text"
                    name="name"
                    id=""
                    class="form-control"
                    placeholder=""
                    aria-describedby="helpId"
                  />
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">Password</label>
                  <input
                    type="text"
                    name="description"
                    id=""
                    class="form-control"
                    placeholder=""
                    aria-describedby="helpId"
                  />
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
                <button type="submit" class="btn btn-warning">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-primary table-dark table-striped">
          <thead>
            <tr>
              <th scope="col">User ID</th>
              <th scope="col">User Email</th>
              <th scope="col">Orders</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="">
              <td scope="row">R1C1</td>
              <td>R1C2</td>
              <td>R1C3</td>
              <td>R1C3</td>
            </tr>
            <tr class="">
              <td scope="row">Item</td>
              <td>Item</td>
              <td>Item</td>
              <td>Item</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class CustomersComponent {
  onSubmit(frm: NgForm) {
    console.log(frm);
  }
  
}
