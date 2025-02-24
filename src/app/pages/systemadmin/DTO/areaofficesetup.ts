import { AgencyProfile } from '../../superadmin/DTO/agencyprofile';
export class AreaOfficeSetup {
    AreaOfficeProfileId: number;
    AreaOfficeName: string;
    IsActive: number = 1;
    UpdatedDate: Date = new Date();
    CreatedDate: Date = new Date();
    CreatedUserId: number = 1;
    UpdatedUserId: number = 1;
    ContactInfo: any;
    AgencyProfile: AgencyProfile = new AgencyProfile();


}