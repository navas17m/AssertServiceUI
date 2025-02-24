import { BaseDTO } from '../../basedto';
import { Contact } from '../../contact/contact';
import { PersonalInfo } from '../../personalinfo/personalinfo';
import { CarerInfo } from './carerinfo';
export class CarerParentDTO extends BaseDTO {

    CarerParentId: number;
    NoOfVaccancies: number;
    CarerCode: string;
    PCFullName: string;
    SCFullName: string;
    CarerId: number;
    AreaOfficeid: number;
    CarerStatusId: number;
    CarerStatusName: string;
    CarerParentStatusId: number;
    IsVacancy: boolean;
    ApprovalDate: Date;
    CategoryofApproval: string;
    AgeRange: string;
    SiblingGroupAcceptible: string;
    ApprovedGender: string;
    CarerTypeId: number;
    AreaOfficeName: string;
    CreatedDate: Date;
    DateOfEnquiry: Date;
    SequenceNo: number;
    ApproveVacancies: number;
    AvailableVacancies: number;
    SupervisingSocialWorker: string;

    CarerInfo: CarerInfo = new CarerInfo();
    PersonalInfo: PersonalInfo = new PersonalInfo();
    ContactInfo: Contact = new Contact();
    
}