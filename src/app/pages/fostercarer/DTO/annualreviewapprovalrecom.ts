import { BaseDTO } from '../../basedto';

export class AnnualReviewApprovalRecomDTO extends BaseDTO {

    CarerAnnualReviewApprovalRecomId: number;
    CarerAnnualReviewId: number;
    NoOfChildren: number;
    Age: string;
    Gender: number;
    Ethnicity: number;
    Religion: number;
    StatusId: number;

    EthnicityName: string;
    ReligionName: string;

}
