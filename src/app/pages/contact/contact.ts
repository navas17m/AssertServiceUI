
import { BaseDTO } from '../basedto';
export class Contact extends BaseDTO {
    ContactInfoId: number;
    City: string = "";
    HomePhone: string="";
    OfficePhone: string = "";
    MobilePhone: string = "";
    Fax: string = "";
    EmailId: string = "";
    AlternativeEmailId: string = "";
    CountyId: number = null;
    CountryId: number = 236;
    PostalCode: string = "";
    EmergencyContact: string = "";
    AddressLine1: string = "";
    AddressLine2: string = "";
 
}

export class ContactVisible {

    CityVisible: boolean = true;
    HomePhoneVisible: boolean = true;
    OfficePhoneVisible: boolean = true;
    MobilePhoneVisible: boolean = true;
    FaxVisible: boolean = true;
    EmailIdVisible: boolean = true;
    AlternativeEmailIdVisible: boolean = true;
    CountyIdVisible: boolean = true;
    CountryIdVisible: boolean = true;
    PostalCodeVisible: boolean = true;
    EmergencyContactVisible: boolean = true;
    AddressLine1Visible: boolean = true;
    AddressLine2Visible: boolean = true;


    CityMandatory: boolean = true;
    HomePhoneMandatory: boolean = true;
    OfficePhoneMandatory: boolean = true;
    MobilePhoneMandatory: boolean = true;
    FaxMandatory: boolean = true;
    EmailIdMandatory: boolean = true;
    AlternativeEmailIdMandatory: boolean = true;
    CountyIdMandatory: boolean = true;
    CountryIdMandatory: boolean = true;
    PostalCodeMandatory: boolean = true;
    EmergencyContactMandatory: boolean = true;
    AddressLine1Mandatory: boolean = true;
    AddressLine2Mandatory: boolean = true;
}


