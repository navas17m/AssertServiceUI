import { AgencyProfile } from '../../superadmin/DTO/agencyprofile';
export class RoleProfile
{
    RoleProfileId: number = null;
    RoleName: string;
    IsActive: number = 1;
    UpdatedDate: Date = new Date();
    CreatedDate: Date = new Date();
    CreatedUserId: number = 1;
    UpdatedUserId: number = 1;
    AgencyProfile: AgencyProfile = new AgencyProfile();
    RoleFormMapping = [];
    DuplicateCheck: boolean = false;
    IsPublic: boolean;
    RoleDocumentTypeMapping = [];
    ModuleStausCnfg = [];
    StaffAreaCategory = [];
}