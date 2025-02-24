
import { BaseDTO } from '../basedto';
import { Contact } from '../contact/contact';
import { PersonalInfo } from '../personalinfo/personalinfo';
export class CarerFamilyInfo extends BaseDTO {

    CarerFamilyInfoId: number;
    CarerId: number;
    CarerParentId: number;
    RelationshipId: number;
    TelePhoneNumber: string;
    SchoolNameAndAddress: string;
    IsLivingAtHome: boolean;
    RelationshipName: string;
    EthinicityId: number;
    ReligionId: number;
    ContactInfoId: number;
    PersonalInfo: PersonalInfo = new PersonalInfo();
    ContactInfo: Contact = new Contact();
    IsChecksRequired: boolean;
    StatusId: number;
}