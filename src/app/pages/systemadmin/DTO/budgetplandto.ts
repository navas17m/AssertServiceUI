export class BudgetPlanDTO {
    BudgetPlanId: number;
    MunicipalId: number;
    SubMunicipalId:number;
    UserId: number;    
    MaintenanceManagementStyleId: string;
    MaintenanceStrategyId: string;
    HRCosts:number;
    MaterialCosts:number;
    EquipmentCosts:number;
    AdministrativeCosts: number;
    OperationalCosts:number;
    TotalEstimatedCost:number;
    AllocationEmergencyEudget: string;
    ReviewGistoricalData: boolean;
    EstimationOfMaintenance: string;  
    IsActive: boolean;  
    UploadId:number;
}