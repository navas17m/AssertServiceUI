
import { BaseDTO } from '../../basedto';
import { Contact } from '../../contact/contact';
import { PersonalInfo } from '../../personalinfo/personalinfo';

export class CarerEmployerInfo extends BaseDTO {

    CarerEmlpoyerInfoId: number;
    CarerParentId: number;
    CarerTypeId: number;
    EmployementDurationAndPost: string;
    StatusId: number;
    Active: number;
    PersonalInfo: PersonalInfo = new PersonalInfo();
    ContactInfo: Contact = new Contact();

    ReferenceTypeId: number;
    CompanyName: string;
    ContactName: string;
    NoticePeriod: number;
    DisciplinaryInCareer: string;
    SuitableDateForYourReference: Date = null;
    ProvidingReference:boolean;
}
