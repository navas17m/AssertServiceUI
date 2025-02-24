/// <reference path="../../superadmin/DTO/agencyprofile.ts" />

import { AgencyProfile } from '../../superadmin/DTO/agencyprofile';


export class CarerInitialInterestInfo {
    CarerInitialInterestId: number;
    FirstName: string;
    LastName: string;
    PhoneNumber: number;
    Email: string;
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    PostalCode: string;
    DoesCarerHaveAccessToCar: number;
    CanCarerGiveUpWork: number;
    SpareBedRoomCount: number = null;
    HaveChildLivingInHome: number = 0;
    RelevantExperience: string;
    SourceOfMeadiumId: number = 0;
    ApplicantStatus: string = "1";
    UserProfileId: number;
    CreateDate: Date = new Date();

    AgencyProfile: AgencyProfile = new AgencyProfile();

}