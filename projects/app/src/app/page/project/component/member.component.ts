import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { MemberWithUser } from '~app/src/app/services/member.service';
import { trpc } from '~app/src/trpcClient';

@Component({
  selector: 'app-member',
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
          .addMember {
            opacity: 1;
            transition: opacity 0.3s;
          }
        }
        &:active {
          background-color: #cfe2ff;
        }
        .addMember {
          opacity: 0;
          transition: opacity 0.3s;
        }
      }
    `,
  ],
  template: `
    <div class="border-end shadow rounded-3 h-100 p-3 ">
      <div class="d-flex justify-content-between py-2  ">
        <h3 class="text-center rounded-3 py-1">Member</h3>
        <button
          *ngIf="isOwner"
          class="btn btn-primary"
          (click)="showAddMember = !showAddMember"
        >
          <i class="fa-solid fa-plus" style="color: #ffffff;"></i>
        </button>
      </div>
      <div [class.d-none]="!showAddMember || !isOwner">
        <form action="">
          <label *ngIf="errorMessage" class="text-danger">{{
            errorMessage
          }}</label>
          <label *ngIf="successMessage" class="text-success">{{
            successMessage
          }}</label>
          <div class="input-group mb-3">
            <input
              #memberEmail
              type="email"
              class="form-control"
              placeholder="Add member to project"
              aria-label="email"
              aria-describedby="basic-addon1"
            />
            <button
              class="btn btn-primary"
              type="button"
              (click)="addMember(memberEmail)"
            >
              <i class="fa-solid fa-plus" style="color: #ffffff;"></i>
            </button>
          </div>
        </form>
      </div>
      <div
        *ngFor="let item of memberList; let i = index"
        class="member position-relative"
      >
        <div class="position-absolute top-0 end-0 me-3 mt-3 addMember">
          <button
            *ngIf="!item.owner"
            class="btn btn-danger"
            (click)="removeMember(item.id)"
          >
            <i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>
          </button>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img
              src="https://picsum.photos/200"
              alt="member"
              class="rounded-circle me-3"
              style="width: 50px; height: 50px;"
            />
            <div>
              <h5 class="mb-0">{{ item.User!.name }}</h5>
              <p class="mb-0 fst-italic " style="font-size: 0.8rem">
                {{ item.User!.email }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MemberComponent {
  @HostBinding('class') class = 'col-3 p-3';
  @Input() isOwner: boolean = false;
  @Input() memberList: MemberWithUser[] = [];
  @Input() projectId: string = '';
  @Output() changeMemberList = new EventEmitter();
  showAddMember = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  constructor() {
  }

  async addMember(target: HTMLInputElement) {
    await trpc.project.addMember
      .mutate({
        projectId: this.projectId,
        email: target.value,
      })
      .then(() => {
        this.errorMessage = null;
        this.successMessage = `Inviation sent to ${target.value}`;
      })
      .catch((err: Error) => {
        this.errorMessage = err.message;
        this.successMessage = null;
      });
  }

  async removeMember(memberId: string) {
    await trpc.project.removeMember
      .mutate({
        memberId,
      })
      .then(async () => {
        this.changeMemberList.emit();
      })
      .catch((err: Error) => {
        this.errorMessage = err.message;
      });
  }
}
