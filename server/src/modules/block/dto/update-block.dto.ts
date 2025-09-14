import { BlockEntity } from "../block.entity";
import { RFGeneratorEntity } from "../rf-generator.entity";

interface UpdateBlockDTO extends Pick<BlockEntity, 'id' | 'name' | 'type'> {
  modName: string;
  rfGenerator?: Partial<RFGeneratorEntity>
};

export default UpdateBlockDTO;