import { LocalAuthority } from './../../systemadmin/DTO/localauthority';
import { BaseDTO} from '../../basedto'
import { Contact } from '../../contact/contact'
export class CarerAddressHistoryDTO extends BaseDTO {

    CarerAddressHistoryId: number;
    CarerParentId: number;
    ContactInfoId: number;
    DateMoved: Date;
    DateMovedOut: Date;
    IsCurrentAddress: number = 0;
    ContactInfo: Contact = new Contact();
    IsPostApprove: number = 2;
    AddressWhenApplied: number =0;
    LocalAuthorityId:number;
    LocalAuthorityName: string;
    StatusId:number;
}
