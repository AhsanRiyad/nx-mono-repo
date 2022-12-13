import { Controller, UseGuards,  } from "@nestjs/common";
import { ProjectService } from "../services/project.service";

@Controller("project")
export class ProjectController {
    constructor(private apiLogService: ProjectService) { }
}