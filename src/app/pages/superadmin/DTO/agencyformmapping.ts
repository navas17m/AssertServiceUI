
import { FormConfig } from './formconfig';

export class AgencyFormMapping {
    AgencyFormMappingId: number;    
    AgencyProfileId: number;
    FormCnfg: FormConfig = new FormConfig();
    IsActive: boolean = false;
    OriginalIsActive: boolean = false;
    ViewAccess: boolean = false;
    AddAccess: boolean = false;
    EditAccess: boolean = false;
    OriginalViewAccess: boolean = false;
    OriginalAddAccess: boolean = false;
    OriginalEditAccess: boolean = false;
    OriginalDeleteAccess: boolean = false;
    DeleteAccess: boolean = false;
    UpdatedDate: Date = new Date();
    CreatedDate: Date = new Date();
    CreatedUserId: number = 1;
    UpdatedUserId: number = 1;
}