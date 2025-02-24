


export class AgencyProfile {
    AgencyProfileId: number;
    AgencyName: string;
    DomainName: string;
    ContactInfoId: number;
    IsItAreaOffice: number;
    Logold: number;
    LogoString: number;
    IsActive: number = 1;
    UpdatedDate: Date = new Date();
    CreatedDate: Date = new Date();
    CreatedUserId: number = 1;
    UpdatedUserId: number = 1;
    ContactInfo: any;
    URNNumber: string;
    IsSelected: boolean;
    InvoicePrefix: string;
    InvoiceAddress: string;
    FCInvoiceNote: string;
    LAInvoiceNote: string;
    FinCarerPaymentTypeCnfgId: number = null;
 //   static ContactInfoVal;

}