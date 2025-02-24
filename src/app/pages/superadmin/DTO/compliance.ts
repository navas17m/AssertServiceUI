import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ComplianceDTO extends BaseDTO {
   
    UniqueID: number;
    ComplianceCheckId: number;
    UserProfileId: number;
    FieldCnfgId: number;
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue[] = [];
    MemberId: number;
    CarerParentId: number;
    ReviewDate: Date;
    IsContentCopytoSC: boolean = false;
    IsDocumentCopytoSC: boolean = false;
    IsStaCheckReload: boolean = false;
    ChildId: number;
    EmployeeId: number;
    UserTypeId: number;
}
