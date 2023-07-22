import { Injectable } from '@angular/core';
import { Prisma } from '@prisma/client';
import { trpc } from '~ecom/src/trpcClient';

const MemberWithUser = Prisma.validator<Prisma.MemberArgs>()({
  include: { User: true },
});
export type MemberWithUser = Prisma.MemberGetPayload<typeof MemberWithUser>;

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  memberList: MemberWithUser[] = [];
  loading = true;
  constructor() {}
  async load(projectId: string) {
    this.memberList = await trpc.project.getMember.query({
      projectId: projectId,
    });
    this.loading = false;
    return this.memberList;
  }

  getMemberbyId(memberId: string) {
    return this.memberList.find((member) => member.id === memberId);
  }
  
}
