export class MaintenanceActivityDTO {
    MaintenanceActivityId: number;
    MunicipalId: number;
    SubMunicipalId:number;
    UserId: number;    
    Maintenancemanagementstyle: boolean;    
    Workordernumber: string;
    TypeofscheduledmaintenanceId:number;
    Dateoflastmaintenance:Date=null;
    Nextmaintenancedate:Date=null;
    PeriodicmaintenanceId: number;
    Workorderissuedate: Date=null;
    Maintenancestartdate: Date=null;
    Maintenancecompletiondate: Date=null;
    PriorityofworkId: number;
    Description: string; 
    Resources:string;
    Estimatinglaborcosts:string;
    Approvals:boolean;
    WorkorderstatusId:number;
    Postmaintenance:string;
    Actualtimetakenformaintenance:string;
    MaintenanceCost:number;
    HRCost:number;
    HRMaterialCost:number;
    OtherCost:number;
    PercentageCompleted:number;
    IsActive:boolean;
}