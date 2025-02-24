import { AgencyFormMapping } from '../../superadmin/DTO/agencyformmapping';
export class RoleFormMapping {
    RoleProfileId: number;   
    AgencyFormMapping: AgencyFormMapping = new AgencyFormMapping();
    IsActive: boolean = false;
    OriginalIsActive: boolean = false;
    ViewAccess: boolean = false;
    AddAccess: boolean = false;
    EditAccess: boolean = false;
    DeleteAccess: boolean = false;
    UpdatedDate: Date = new Date();
    CreatedDate: Date = new Date();
    CreatedUserId: number = 1;
    UpdatedUserId: number = 1;
}