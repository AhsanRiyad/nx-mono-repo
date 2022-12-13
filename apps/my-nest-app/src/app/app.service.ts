import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ProjectService } from '@dcltracker/projects';
// import { ProjectService } from 'libs/projects/src/lib/services/project.service';

@Injectable()
export class AppService {
  constructor(
    private projectService: ProjectService
  ){

  }

  test(){
    return this.projectService.test();
  }

  getData(): { message: string } {
    return { message: 'Welcome to my-nest-app!' };
  }
}
