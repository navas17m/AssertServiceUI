export class BudgetPlanDTO {
    BudgetPlanId: number;
    MunicipalId: number;
    UserId: number;    
    MaintenanceManagementStyle: string;
    MaintenanceStrategy: string;
    HRCosts:number;
    MaterialCosts:number;
    EquipmentCosts:number;
    AdministrativeCosts: number;
    OperationalCosts:number;
    AllocationEmergencyEudget: string;
    ReviewGistoricalData: boolean;
    EstimationOfMaintenance: string;  
    IsActive: boolean;  
}