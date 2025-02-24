import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class CarerDayLogJournal extends BaseDTO {
    CarerDayLogJournalId: number;
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