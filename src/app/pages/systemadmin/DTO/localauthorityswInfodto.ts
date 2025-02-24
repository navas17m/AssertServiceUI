
import { BaseDTO } from '../../basedto';
import { Contact } from '../../contact/contact';
export class LocalAuthoritySWInfoIdDTO extends BaseDTO {
    LocalAuthoritySWInfoId: number;  
    LocalAuthoritySWInfoName: string;
    EDTNumber: string;
    LocalAuthorityId: number;
    UserId: number;   
    ContactInfo: Contact = new Contact();
}