/// <reference path="../../basedto.ts" />
import { BaseDTO } from '../../basedto'
import { Contact } from '../../contact/contact'
import { PersonalInfo } from '../../personalinfo/personalinfo'
import { AgencyProfile } from '../../superadmin/DTO/agencyprofile'
import { RoleProfile } from './roleprofile'
import { UserAreaOfficeMapping } from './userreaofficemapping'
import { UserType } from './usertype'
export class UserProfile extends BaseDTO {
    UserProfileId: number;
    LoginId: string;
    Password: string;
    IsAccountLocked: boolean = false;
    IsPasswordReset: boolean = false;
    NumberOfAttempts: number = 2;
    LastLoggedInDate: Date = new Date();
    //IsActive: boolean = true;
    //UpdatedDate: Date = new Date();
    //CreatedDate: Date = new Date();
    //CreatedUserId: number = 1;
    //UpdatedUserId: number = 1;
    CheckTypeId: number;

    AgencyProfile: AgencyProfile = new AgencyProfile();
    RoleProfile: RoleProfile = new RoleProfile();
    ContactInfo: Contact = new Contact();
    PersonalInfo: PersonalInfo = new PersonalInfo();
    UserTypeCnfg: UserType = new UserType();
    UserAreaOfficeMapping = new UserAreaOfficeMapping();
    CarerParentId: number;
    CanSeeAllCarer: boolean;
    CanSeeAllChildren: boolean;
    CanSeeAllEmployee: number = 1;
    IsShowDashboard: boolean;
    ActiveFlag: boolean;
    IsReset:boolean;
    PasswordExpiryDateCount:number;
}