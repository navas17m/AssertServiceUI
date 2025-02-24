import { BaseDTO } from '../../basedto';
export class AgencySignatureMappingDTO extends BaseDTO {
    AgencySignatureMappingId: number;
    FormDisplayName: string;
    SignatureIds: string;
    arrSignatureIds = [];
    OriginalIsActive: boolean;
    ActiveFlag: boolean;
    OriginalActiveFlag: boolean;
    lstAgencySignatureMapping = [];
}