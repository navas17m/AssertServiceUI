import { BaseDTO } from '../../basedto';
import { Contact } from '../../contact/contact';
export class PlacementContactDTO extends BaseDTO {
    PlacementContactInfoId: number;
    LocalAuthorityId: number;
    FirstName: string;
    LastName: string;
    JobTitleId: number;
    ContactInfoId: number;
    ContactInfo: Contact = new Contact();
}