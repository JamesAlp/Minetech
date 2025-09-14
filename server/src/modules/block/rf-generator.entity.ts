import { Entity, OneToOne, JoinColumn, Column } from "typeorm";
import { BlockEntity } from "./block.entity";
import { BaseEntity as AbstractBaseEntity } from "src/common/base.entity";

// rf-generator.entity.ts (owning side)
@Entity({ name: 'rf_generators' })
export class RFGeneratorEntity extends AbstractBaseEntity {
  @OneToOne(() => BlockEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'block_id' })         // owner
  block: BlockEntity;

  @Column({ name: 'rf_per_tick', type: 'int', unsigned: true })
  rfPerTick: number;
}
