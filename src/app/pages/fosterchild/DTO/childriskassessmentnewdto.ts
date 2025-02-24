
import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildRiskAssessmentNewComboDTO extends BaseDTO {
    UniqueID: number;
    SequenceNo: number;
    ControlLoadFormat: string[];
    DynamicValue: DynamicValue[] = [];
    ChildId: number;
    LstAgencyFieldMapping = [];
    lstChildRiskAssessmentNewSignificant = [];
    lstChildRiskAssessmentNewRisksCausing = [];
      
}

export class ChildRiskAssessmentNewDTO extends BaseDTO {
    DynamicValue: DynamicValue[] = [];
    SequenceNo: number;
    ChildId: number;
  
}

export class ChildRiskAssessmentNewSignificantDTO extends BaseDTO {
    SequenceNo: number;
    ChildId: number;
    DynamicValue: DynamicValue[] = [];
    Risk: string;
    Date: Date;
    StatusId: number;
    ChildRiskAssessmentNewSignificantId: number;
    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    FieldDataTypeName: string;
    FieldValueText: string;
    UniqueID: number;
}


export class ChildRiskAssessmentNewRisksCausingDTO extends BaseDTO {
   
    DynamicValue: DynamicValue[] = [];
    ControlLoadFormat: string[];
    SequenceNo: number;
    ChildId: number;
    StatusId: number;
   

    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    FieldDataTypeName: string;
    FieldValueText: string;
    UniqueID: number;
    
}
//Paramount new risk assessment dto changes.
