import { BaseDTO } from '../../basedto';
export class AgencySignatureCnfgDTO extends BaseDTO {
    AgencySignatureCnfgId: number;
    FormDisplayName: string;    
    SignatureIds: string; 
    arrSignatureIds = [];   
    OriginalIsActive: boolean;
    ActiveFlag: boolean;
    OriginalActiveFlag: boolean;
    lstAgencySignatureMapping = [];    
}