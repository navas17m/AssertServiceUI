
export class ChildRespiteDetailDTO {
    ChildRespiteId: number;
    ChildOriginalPlacementId: number;
    ChildRespitePlacementId: number;
    RespiteToCarerId: number;   
    IsPaid: boolean;
    IsPlanned: boolean;
    Rate: number = 0;
    IsBackupCarer: boolean;
    BackupCarerId: number;
    PlannedRespiteStartDate: Date;
    PlannedRespiteEndDate: Date;    
}