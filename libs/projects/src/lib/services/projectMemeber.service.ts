import { Inject, Injectable } from '@nestjs/common';
import { ProjectAbstract } from '../abstractions/project.abstract';

@Injectable()
export class ProjectMemberService {

    name: string;
    public test(){
        return "hello world";
    }

}
