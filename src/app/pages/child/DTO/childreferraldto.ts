import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildReferralDT0 extends BaseDTO {
    ChildReferralId: number;   
    ChildId: number;
    ReferralName: string;
    ReferralDate: Date;
    NFADate: Date;
    NFAReasonId: number;
    NFAReason: string;
    LASocialWorkerId: number;
    DynamicValue: DynamicValue[];    
    lstAgencyFieldMapping = [];
    ContactTypeId:number=null;
    ContactTypeName:any;
}