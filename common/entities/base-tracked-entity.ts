import { Column, JoinColumn, ManyToOne } from "typeorm";
import { CommonEntity } from "./common-entity.js";
import { ApiUser } from "../../modules/api-user/entities/api-user.entity.js";

export abstract class BaseTrackedEntity extends CommonEntity {

}