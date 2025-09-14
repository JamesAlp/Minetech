import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne, OneToOne, Unique } from "typeorm";
import { ModEntity } from "../mod/mod.entity";
import { RFGeneratorEntity } from "./rf-generator.entity";

export enum BlockType {
  NONE = 'None',
  RF_GENERATOR = 'RF Generator',
  RF_STORAGE = 'RF Storage'
}

@Entity({ name: 'blocks' })
@Unique('uq_blocks_mod_name', ['mod', 'name']) // prevent duplicate names within the same mod
export class BlockEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 200,
    nullable: false
  })
  name: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: BlockType,
    default: BlockType.NONE
  })
  type: BlockType;

  @ManyToOne(() => ModEntity, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  mod: ModEntity;

  @OneToOne(() => RFGeneratorEntity, (g) => g.block, { nullable: true, eager: false })
  rfGenerator?: RFGeneratorEntity;          // <-- inverse relation (no @JoinColumn here)
}