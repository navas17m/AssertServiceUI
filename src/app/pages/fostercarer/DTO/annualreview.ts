
import {DynamicValue} from '../../dynamic/dynamicvalue'
import { BaseDTO} from '../../basedto'
import { AnnualReviewApprovalRecomDTO} from './annualreviewapprovalrecom'
export class AnnualReviewDTO extends BaseDTO {
    TypeId:number;
    UniqueID: number;
    CarerAnnualReviewId: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    ControlLoadFormat = [];
    ApprovalRecomList: AnnualReviewApprovalRecomDTO = new AnnualReviewApprovalRecomDTO();
    DynamicValue: DynamicValue[] = [];

    SequenceNum: number;
    PlacementChildId: number;
    PlacementChildIds = [];
    ChildPlacementInfo = [];
    IsStaCheckReload: boolean = false;
    dynamicformcontrol = [];

    //Nurture Annual Review fields.
}
