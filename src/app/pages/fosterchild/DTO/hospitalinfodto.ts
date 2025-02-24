
import { BaseDTO } from '../../basedto';
import { Contact } from '../../contact/contact';

export class HospitalInfoDTO extends BaseDTO {
    HospitalInfoId: number;
    HospitalName: string;
    ContactInfoId: number;
    ContactInfo: Contact = new Contact();
}