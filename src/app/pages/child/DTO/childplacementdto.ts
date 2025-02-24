import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';
import { ChildRespiteDetailDTO } from './childrespitedetaildto';
import { CarerInfo } from '../../recruitment/DTO/carerinfo';

export class ChildPlacementDTO extends BaseDTO {
    ChildPlacementId: number;
    ChildId: number;
    CarerParentId: number;
    VacancyId: number;
    PlacementStartTypeId: number;  
    PlacementTypeId: number; 
    PlacementDate: Date;
    PlacementCategoryId: number;
    LocalAuthorityId: number;
    AgencySocialWorkerId: number;
    PlacementEndDate: Date;
    DischargeDate: Date;
    PlacementEndReasonId: number;
    OldPlacementId: number;
    LocalAuthorityName: string;
    DynamicValue: DynamicValue[];
    ChildRespiteDetail: ChildRespiteDetailDTO = new ChildRespiteDetailDTO();    
    CarerInfo: CarerInfo = new CarerInfo();
    PlacementReason: string;
    IsStayingPut:boolean=false;
    //SSW name in Child Transfer
}