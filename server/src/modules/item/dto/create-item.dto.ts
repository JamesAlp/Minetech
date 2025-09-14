import { ModEntity } from "../item.entity";

type CreateModDto = Pick<ModEntity, 'name'>;

export default CreateModDto;