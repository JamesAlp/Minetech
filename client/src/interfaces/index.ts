export enum BlockType {
  NONE = 'None',
  RF_GENERATOR = 'RF Generator',
  RF_STORAGE = 'RF Storage'
}

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ModEntity extends BaseEntity {
  name: string;
}
export type CreateModDTO = Pick<ModEntity, 'name'>;

export interface BlockEntity extends BaseEntity {
  name: string;
  type?: BlockType;
  mod: ModEntity;
  rfGenerator: RFGenerator
}
export interface CreateBlockDTO extends Pick<BlockEntity, 'name' | 'type'> {
  modName: string;
  rfPerTick?: number;
}
export interface UpdateBlockDTO extends Pick<BlockEntity, 'id' | 'name' | 'type'> {
  modName: string;
  rfGenerator?: RFGenerator;
}

export interface RFGenerator extends BaseEntity {
  rfPerTick: number;
}