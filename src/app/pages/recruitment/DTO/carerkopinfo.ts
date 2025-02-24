
import { BaseDTO } from '../../basedto';

export class CarerKOPInfo extends BaseDTO {
    CarerKOPInfoId: number;
    CarerParentId: number;
    AgeRangeFrom: number = null;
    AgeRangeTo: number = null;
    NumberOfChirldren: number = null;
    Gender: number = null;
    HasBlingGroupAcceptable: boolean;
    KOPEthnicityIds: string;
    KOPNationalityIds: string;
    KOPReligionIds: string;
    KOPDisabilityIds: string;
    KOPImmigrationStatusIds: string;
    KOPPlacementTypeIds: string;

}