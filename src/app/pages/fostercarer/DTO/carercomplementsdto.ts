import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class CarerComplementsDTO extends BaseDTO {
    CarerComplementsId: number;
    UniqueID: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    CarerParentIds = [];
    DynamicValue: DynamicValue = new DynamicValue();
	EntryTypeId:number;
	Subject:string;	
    DateofOccurrence:Date;
}