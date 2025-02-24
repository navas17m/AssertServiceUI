
import { BaseDTO } from '../../basedto'
import { ChildReferralDT0 } from '../../child/DTO/childreferraldto'
import { Contact } from '../../contact/contact'
import { PersonalInfo } from '../../personalinfo/personalinfo'
import { AreaOfficeProfile } from '../../systemadmin/DTO/areaofficeprofile'
import { LocalAuthority } from '../../systemadmin/DTO/localauthority' 
export class ChildProfile extends BaseDTO {
    ChildId: number;
    ChildCode: string;
    ChildIdentifier: string;
    ChildOrParentId: number=1;
    PersonalInfo: PersonalInfo = new PersonalInfo();
    ContactInfo: Contact = new Contact();
    AreaOfficeProfile: AreaOfficeProfile = new AreaOfficeProfile();
    LocalAuthority: LocalAuthority = new LocalAuthority();
    GeographicalId: number = null;
    EthinicityId: number = null;
    Ethinicity: string;
    OfstedEtnicityId: number = null;
    ReferrelDate: Date = null;
    ChildInEducationId: number;
    ChildStatusId: number;
    ChildStatusIds:[];
    NewChildStatusId: number;
    NFADate: Date=null;
    NFAReasonId: number;
    IsSelected: boolean;
    LanguageId = [];
    LegalStatusId: number = null;
    NationalityId: number = null;
    ReligionId: number = null;
    Religion: string;
    ImmigrationStatusId: number = null;
    ImmigrationStatus: string;
    DisabilityIds = [];
    DisabilityStrIds: string;
    BehavioralIds = [];
    Synopsis: string;
    NoFurtherAction: boolean;
    HasChildSiblings: boolean;  
    HasChildParents: boolean;
    SiblingIds = [];
    ParentIds = [];
    ParentId:number = null;
    ChildReferral: ChildReferralDT0 = new ChildReferralDT0();
    ChildPlacementId: number;
    CarerParentId: number;
    DisabilityStr: string;
    ReferralDate: Date = null;
    CarerName: string;
    LastPlacedCarerName: string;
    SupervisingSocialWorker: string;
    SupervisingSocialWorkerId: number;
    RecommendedCarers: string;    
    StatusChangeDate: Date;
    ParentName: string;
    ParentDateOfBirth: Date = null;
    ParentName2: string;
    ParentDateOfBirth2: Date = null;
    ChildPlacingAuthorityId: number = null;
    LANotifiedDate: Date = null;
    LASocialWorker: string;
    PlacementStartTypeId:number;
    Type: string;
    ChildInEducation: string;
    Nationality: string;
    LegalStatus: string;
    LanguageStrId: string;
    IsOutofHoursPlacement:boolean;
    ChildMobileNo:string;
    ChildContactType=[];
    KnownAllergies:string;
    EthnicityDetails:string;
    HealthNeedsIds = [];
    HealthNeedsStrIds: string;
}
