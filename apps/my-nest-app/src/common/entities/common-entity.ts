import {
  Column,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { ApiUser } from "../../modules/api-user/entities/api-user.entity.js";
export abstract class CommonEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => ApiUser, {
    nullable: true,
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "created_by",
    referencedColumnName: "id",
  })
  created_by_user: Relation<ApiUser>;

  @Column({ nullable: true })
  created_by: string;

  @ManyToOne(() => ApiUser, {
    nullable: true,
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "updated_by",
    referencedColumnName: "id",
  })
  updated_by_user: Relation<ApiUser>;

  @Column({ nullable: true })
  updated_by: string;

  @Column({
    type: "timestamp",
    default: new Date(),
  })
  created_at: Date;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: "timestamp",
    nullable: true,
  })
  deleted_at?: Date;
}
