
import { BaseDTO} from '../../basedto'
import {PersonalInfo} from '../../personalinfo/personalinfo'
import {Contact} from '../../contact/contact'
//import {AreaOfficeProfile} from '../../superadminDTO/areaofficeprofile'
export class ChildDetailsDTO extends BaseDTO {
    ChildId: number;
    ChildCode: string;
    ChildIdentifier: string;
    PersonalInfo: PersonalInfo = new PersonalInfo();
    ContactInfo: Contact = new Contact();
    //AreaOfficeProfile: AreaOfficeProfile = new AreaOfficeProfile();
    GeographicalId: number;
    EthinicityId: number;
    Ethinicity: string;
    OfstedEtnicityId: number;
    ReferrelDate: Date;
    ChildInEducationId: number;
    ChildStatusId: number;
    NFADate: Date;
    NFAReasonId: number;
    IsSelected: boolean;
    LanguageId: number;
    LegalStatusId: number;
    NationalityId: number;
    ReligionId: number;
    Religion: string;
    ImmigrationStatusId: number;
    ImmigrationStatus: string;
    DisabilityIds = [];
    Synopsis: string;
    NoFurtherAction: boolean;
    HasChildSiblings: boolean;
    HasChildParents: boolean;
    SiblingIds = [];
    ParentIds = [];
}