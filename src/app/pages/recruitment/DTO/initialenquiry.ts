
import { BaseDTO } from '../../basedto'
import { Contact } from '../../contact/contact'
import { DynamicValue } from '../../dynamic/dynamicvalue'
import { PersonalInfo } from '../../personalinfo/personalinfo'
import { CarerInfo } from './carerinfo'
import { CarerInitialInterestInfo } from './carerinterestinfo'

export class InitialEnquiryDTO extends BaseDTO {
    CarerInitialHomeVisitInfoId: number;
    CarerParentId: number;
    AreaOfficeid: number;
    SpareBedRoomCount: number;
    SourceOfMediumId: number;
    ContactInfo: Contact = new Contact();
    ContactInfoSA: Contact = new Contact();
    DynamicValue: DynamicValue = new DynamicValue();
    CarerInfo: CarerInfo[] = [];
    CarerInitialInterestInfo: CarerInitialInterestInfo = new CarerInitialInterestInfo();
    PersonalInfo: PersonalInfo = new PersonalInfo();
    PersonalInfoSA: PersonalInfo = new PersonalInfo();

    ReligionId: number;
    EthinicityId: number;
    ReligionIdSA: number;
    EthinicityIdSA: number;
    DateOfEnquiry: Date;

    HasPermanentResidencyInUK: boolean = true;
    PermanentResidencyDetails: string;

    saHasPermanentResidencyInUK: boolean = true;
    saPermanentResidencyDetails: string;
    HaveRelationshipAbove2Years: boolean;
    RelationshipAbove2YearsDetails: string;
    DraftSequenceNo: number;

    DoYouHaveYourOwnVehicle:boolean;
    DoesCarerDriveCar:boolean;
    VehicleRegistrationNumber:string;
    DrivingLicenceNumber:string;


    DoYouHaveYourOwnVehicleSA:boolean;
    DoesCarerDriveCarSA:boolean;
    VehicleRegistrationNumberSA:string;
    DrivingLicenceNumberSA:string;

    DisabilityIdsPC:any;
    DisabilityIdsSC:any;
    HasDisabilityPC:any;
    HasDisabilitySC:any

}
