
import { BaseDTO } from '../../basedto';


export class CLADocumentationDTO extends BaseDTO {
    CLADocumentationId: number;
    ChildId: number;

    LAPlacementPlanDate: Date;
    LAPlacementPlanOnFile: number = null;

    LARiskAssessmentDate: Date;
    LARiskAssessmentOnFile: number = null;
    
    DelegatedAuthorityDate: Date;
    DelegatedAuthorityOnFile: number = null;
    
    CLAMedicalDate: Date;
    CLAMedicalOnFile: number = null;
    
    CLAReviewDate: Date;
    CLAReviewOnFile: number = null;
    
    CarePlanPt1Date: Date;
    CarePlanPt1OnFile: number = null;
    
    CarePlanPt2Date: Date;
    CarePlanPt2OnFile: number = null;
    
    PEPDate: Date;
    PEPOnFile: number = null;
    
    EHCPDate: Date;
    EHCPOnFile: number = null;

    PathwayPlanDate: Date;
    PathwayPlanOnFile: number = null;

    PlacementAgreementDate: Date;
    PlacementAgreementOnFile: number = null;

    PlacementInformationDate: Date;
    PlacementInformationOnFile: number = null;

    GrabPackDate: Date;
    GrabPackOnFile: number = null;

    LAPlacementPlanComments : string;
    LARiskAssessmentComments : string;
    DelegatedAuthorityComments : string;
    CLAMedicalComments : string;
    CLAReviewComments : string;
    CarePlanPt1Comments : string;
    CarePlanPt2Comments : string;
    PEPComments : string;
    EHCPComments : string;
    PathwayPlanComments : string;
    PlacementAgreementComments : string;
    PlacementInformationComments : string;
    GrabPackComments : string;
}