
import { BaseDTO } from '../../basedto';
import { Contact } from '../../contact/contact';
import { PersonalInfo } from '../../personalinfo/personalinfo';

export class CarerReferenceInfo extends BaseDTO {

    CarerReferenceInfoId: number;
    CarerParentId: number;
    CarerTypeid: number;
    PersonalInfo: PersonalInfo = new PersonalInfo();
    ContactInfo: Contact = new Contact();
    StatusId: number;
    IsCopyRefToSecondCarer:boolean = false;
    ComplianceCheckId:number;
    ComplianceCheckName:number;
    GivingWrittenComments:boolean;
}
