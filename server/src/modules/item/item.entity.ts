import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne, OneToOne, Unique } from "typeorm";
import { ModEntity } from "../mod/mod.entity";

@Entity({ name: 'item' })
@Unique('uq_item_mod_name', ['mod', 'name']) // prevent duplicate names within the same mod
export class ItemEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 200,
    nullable: false
  })
  name: string;

  @ManyToOne(() => ModEntity, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  mod: ModEntity;
}