import { Common } from './common';
export class BaseDTO {
    DomainName: string;
    AgencyProfileId: number = parseInt(Common.GetSession("AgencyProfileId"));
    FormCnfgId: number;
    IsActive: boolean = true;
    UpdatedDate: Date = new Date();
    CreatedDate: Date = new Date();
    CreatedUserId: number = parseInt(Common.GetSession("UserProfileId"));
    UpdatedUserId: number = parseInt(Common.GetSession("UserProfileId"));
    UploadDocumentIds = [];
    NotificationEmailIds=[];
    NotificationAddtionalEmailIds: string;
    IsSubmitted: boolean = true;
	SearchOrder=[];
	Year:string;
	Month:string;
    AgencySignatureCnfgId:number;
    Test:number;
}
