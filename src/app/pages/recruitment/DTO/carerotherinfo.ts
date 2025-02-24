/// <reference path="../../personalinfo/personalinfo.ts" />
/// <reference path="../../contact/contact.ts" />
import { BaseDTO } from '../../basedto';
import { Contact } from '../../contact/contact';
import { PersonalInfo } from '../../personalinfo/personalinfo';
export class CarerOtherInfo extends BaseDTO {
    CarerOtherInfoId: number;
    CarerParentId: number;
    DateOfMarriage: Date=null;
    PlaceOfMarriage: string;
    StateFosteringInterest: string;
    ChildBehaviourNotAccept: string;
    HouseholdInfo: string;
    RelyonSupport: string;
    FosteringIssuesTrainingNeeds: string;
    SupportNeedComments: string;
    LivingLocalAuthorityId: number = null;
    HavePresentlyFostering: boolean;
    PresentlyFosteringDetails: string;
    HaveAppliedToFosterCarer: boolean;
    AppliedToFosterCarerDetail: string;
    FamilyGPPersonalInfoId: number;
    FamilyGPContactId: number;
    PartnershipTypeId: number;
    DateofRegistration: Date=null;
    PlaceofRegistration: string;
    DateSetUpHomeTogether: Date=null;
    PersonalInfo: PersonalInfo = new PersonalInfo();
    ContactInfo: Contact = new Contact();
    OwnershipOfPropertyId:number;
    HouseTypeId:number;
    TotalBedRoomCount:number;
    SpareBedRoomCount:number;
    PlanToMoveInNearFuture:boolean;
    HaveAnyPets:boolean;
    PetsDetails:string;
    DoesApplicantChildCareExprience:boolean;
    ApplicantChildCareExprienceDetail:string;
    AreImplecationInReligion:boolean;
    ImplecationInReligionDetails:string;
    DoFosterOtherReligionChild:boolean;
    FosterOtherReligionChildComments:string;
    DoesApplicantPromotingEO:boolean;
    EqualOpportunitiesComments:string;
    DoBackupCarerInMind:boolean;
}
