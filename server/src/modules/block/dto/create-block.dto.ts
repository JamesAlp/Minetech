import { BlockEntity } from "../block.entity";

interface CreateBlockDTO extends Pick<BlockEntity, 'name' | 'type'> {
  modName: string;
  rfPerTick?: number;
};

export default CreateBlockDTO;