import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, Unique } from "typeorm";

@Entity({ name: 'mods' })
@Unique('uq_mods_name', ['name'])
export class ModEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 200,
    nullable: false
  })
  name: string;
}