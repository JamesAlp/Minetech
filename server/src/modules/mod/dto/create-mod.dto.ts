import { ModEntity } from "../mod.entity";

type CreateModDto = Pick<ModEntity, 'name'>;

export default CreateModDto;