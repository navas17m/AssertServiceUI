import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class ChildCLAReview extends BaseDTO {
    ChildCLAReviewId: number;
    UniqueID: number;
    ChildId: number;
    FieldCnfgId: number;o
    FieldValue: string;
    SequenceNo: number;
    DynamicValue: DynamicValue = new DynamicValue();
}