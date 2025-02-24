
import { BaseDTO } from '../../basedto';
import { Contact } from '../../contact/contact';
import { PersonalInfo } from '../../personalinfo/personalinfo';

export class BackupCarerInfoDTO extends BaseDTO {
    IsDocumentExist: boolean;
    CarerId: number;
    CarerParentId: number;
    CarerCode: string;
    CarerTypeid: number;
    EthinicityId: number = null;
    ReligionId: number = null;
    PractisingStatus: boolean = null;
    LanguagesSpokenIds: string;
    IsChecksRequired: boolean;
    DraftSequenceNo: number;
    PersonalInfo: PersonalInfo = new PersonalInfo();
    ContactInfo: Contact = new Contact();
    StatusId:number;
}
