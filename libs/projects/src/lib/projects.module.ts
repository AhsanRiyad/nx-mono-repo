
import { DynamicModule, Module } from '@nestjs/common';
import { ProjectAbstract } from './abstractions/project.abstract';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { ProjectMemberService } from './services/projectMemeber.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectMemberService],
  exports: [ProjectService],
})
export class ProjectsModule {
  static register(service: ProjectAbstract): DynamicModule {
    // let service : any;
    // if(options){
    //   service = options; 
    // }
    return {
      module: ProjectsModule,
      providers: [
        // service,
        {
          provide: 'SERVICE',
          useValue: service,
        },
      ],
      exports: [],
    };
  }
}
