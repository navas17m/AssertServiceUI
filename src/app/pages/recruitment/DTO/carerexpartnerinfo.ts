import { BaseDTO } from '../../basedto';
import { Contact } from '../../contact/contact';
import { PersonalInfo } from '../../personalinfo/personalinfo';
export class CarerExPartnerInfo extends BaseDTO {



    CarerExPartnerInfoId: number;
    CarerParentId: number;
    CarerTypeId: number;
    RelationshipTypeId: number;
    RelationshipDurationAndDetail: string;
    StatusId: number;
    RelationshipTypeName: string;
    PersonalInfo: PersonalInfo = new PersonalInfo();
    ContactInfo: Contact = new Contact();


}