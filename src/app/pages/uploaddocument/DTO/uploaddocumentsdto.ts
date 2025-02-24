import { Common } from '../../common';
import { BaseDTO} from '../../basedto'
export class UploadDocumentsDTO {
    DocumentId: number;
    FormCnfgId: number;
    TblPrimaryKeyId: number;
    AgencyProfileId: number;
    UploadedDate: Date;
    UserProfileId: number;
    UserName: string;
    IsCommon: boolean = Common.GetSession("IsCopyThisDocumenttoCommon") == 'true' ? true : false;
    DocumentTypeId: number;
    DocumentName: string;
    IsActive: boolean;
    IsLock: boolean;
    FileData: Blob;
    Password: string;
    ColorCode: string;
    Title: string;
    Description: string;
    UserTypeCnfgId: number;
    Id: number;
    OtherSequenceNumber = [];
    IsMultiUserSave: boolean;
    ModuleId: number;
    ExpiryDate: Date = null;
    DocumentDate: Date = null;
    UpdatedDate: Date;
    UpdatedUserId: number;
    FromDate:Date;
    ToDate:Date;
   
}

export class EventsGalleryDTO extends BaseDTO {
    EventsGalleryId: number;
    ChildId: number;
    Title: string;
    EventDate: Date;
    CategoryId: number;
    CategoryName:string;
    Details: string;
    FileName: string;
    FileType: string;
    FileInfo: Blob;
    StringFileInfo: string;
    LinkId: number;
    Skip:number;
    Take:number;
}