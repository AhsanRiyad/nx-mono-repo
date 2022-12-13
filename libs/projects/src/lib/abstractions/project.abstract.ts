import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class ProjectAbstract {
  abstract name: string;
  test(){
    return "abstract";
  }
}