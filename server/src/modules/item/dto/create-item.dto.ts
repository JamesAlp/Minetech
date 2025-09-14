import { ItemEntity } from "../item.entity";

type CreateModDto = Pick<ItemEntity, 'name'>;

export default CreateModDto;