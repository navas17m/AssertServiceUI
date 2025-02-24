//This class is without carerinfo property.
import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';
import { ChildRespiteDetailDTO } from './childrespitedetaildto';

export class ChildPlacementNewDTO extends BaseDTO {
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
    PlacementReason: string;
    IsStayingPut:boolean=false;
}