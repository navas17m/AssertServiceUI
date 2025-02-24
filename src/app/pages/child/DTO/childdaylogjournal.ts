import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildDayLogJournal extends BaseDTO {
    ChildDayLogJournalId: number;
    UniqueID: number;
    ChildId: number;
    FieldCnfgId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();   
	EntryTypeId:number;
	Subject:string;	
}