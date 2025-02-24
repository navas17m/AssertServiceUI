
import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';
export class CarerApprovalPreferenceDTO extends BaseDTO {
    CarerParentId: number;
    CarerApprovalPreferenceId: number;
    CategoryofApprovalName: string;
    CategoryofApprovalId: number = null;
    AgeRangeMin: number;
    AgeRangeMax: number;
    NoOfVacancy: number;
    NoOfPlacement: number;
    Gender: number;
    IsSiblingGroupAcceptible: number=null;
    ApprovalDate: Date=null;
    CarerId: number;
    NextAnnualReviewDate: Date;
    PCFullName: string;
    SCFullName: string;
    PCDOB: Date;
    SCDOB: Date;
    CarerCode: string;

    DynamicValue: DynamicValue[] = [];
    IsEdit: boolean;
    StatusEndDate: Date = null;
    DynamicValueCheckListInt: DynamicValue[] = [];
    DynamicValueCheckList1: DynamicValue[] = [];
    DynamicValueCheckList2: DynamicValue[] = [];

    Ethnicity: string;
    Religion: string;
    Immigrations: string;
    Disability: string;
    PlacementType: string;
   

}
