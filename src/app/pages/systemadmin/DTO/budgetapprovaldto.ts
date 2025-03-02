﻿export class BudgetApprovalDTO {
    BudgetApprovalId: number;
    MunicipalId: number;
    UserId: number;    
    BudgetApprovals: boolean;
    BudgetApprovalReason: string;
    MonitoringBudgetImplementation:string;
    PeriodicReports:string;
    EmergencyModifications:boolean;
    EmergencyModificationReason: string;
    BudgetDisparity:string;   
    BudgetDisparityAction: boolean;
    BudgetDisparityDescription: string;  
    IsActive: boolean;  
}