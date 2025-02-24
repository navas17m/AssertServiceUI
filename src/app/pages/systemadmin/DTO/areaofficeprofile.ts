import { AgencyProfile } from '../../superadmin/DTO/agencyprofile';
import { UserAreaOfficeMapping } from './userreaofficemapping';
export class AreaOfficeProfile {
    AreaOfficeProfileId: number = null;
    AreaOfficeName: string;
    IsActive: number = 1;
    UpdatedDate: Date = new Date();
    CreatedDate: Date = new Date();
    CreatedUserId: number = 1;
    UpdatedUserId: number = 1;
    AgencyProfile: AgencyProfile = new AgencyProfile();
    UserAreaOfficeMapping: UserAreaOfficeMapping = new UserAreaOfficeMapping();
}