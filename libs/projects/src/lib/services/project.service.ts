import { Inject, Injectable } from '@nestjs/common';
import { ProjectAbstract } from '../abstractions/project.abstract';
import { ProjectMemberService } from './projectMemeber.service';
import { CommonServices } from "@common-services/common/services/common.services" 

@Injectable()
export class ProjectService {
  name: string;

  constructor(private projectMemberService: ProjectMemberService) {
    const a = new CommonServices();
  }


  // name: string = "abc";

  public test() {
    return 'hello world';
  }
}
