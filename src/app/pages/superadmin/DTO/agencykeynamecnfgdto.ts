
import { BaseDTO } from '../../basedto';

export class AgencyKeyNameCnfgDTO extends BaseDTO {
    AgencyKeyNameCnfgId: number;
    KeyName: string;
}


export class AgencyKeyNameValueCnfgDTO extends BaseDTO {
    AgencyKeyNameValueCnfgId: number;
    AgencyKeyNameCnfgId: number;
    Value: string;
    IsApproved:boolean;
}