
import { BaseDTO } from '../basedto';
export class PersonalInfo extends BaseDTO {
    PersonalInfoId: number;
    TitleId: number = null;
    FirstName: string;
    MiddleName: string;
    lastName: string;
    PreviousName: string;
    ImageId: number;
    DateOfBirth: Date=null;
    GenderId: number = null;
    Age: number;
    DOBString: string;
    ImageString: string;
}


export class PersonalInfoVisible {

    TitleVisible: boolean = true;
    FirstNameVisible: boolean = true;
    MiddleNameVisible: boolean = true;
    lastNameVisible: boolean = true;
    PreviousNameVisible: boolean = true;
    ImageIdVisible: boolean = true;
    DateOfBirthVisible: boolean = true;
    genderIdVisible: boolean = true;
    AgeVisible: boolean = true;


    TitleMandatory: boolean = true;
    FirstNameMandatory: boolean = true;
    MiddleNameMandatory: boolean = false;
    lastNameMandatory: boolean = true;
    PreviousNameMandatory: boolean = false;
    ImageIdMandatory: boolean = false;
    DateOfBirthMandatory: boolean = false;
    genderIdMandatory: boolean = true;
    AgeMandatory: boolean = false;

    
}


export class PersonalInfoMandatory {

   
}