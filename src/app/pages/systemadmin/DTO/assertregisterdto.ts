export class AssertRegister {
    AssertRegisterId: number;
    MunicipalId: number;
    UserId: number;    
    IdentificationNumber: string;
    LocationOfOrigin: string;
    CoordinatesX:string;
    CoordinatesY:string;
    GoogleMapsLink:string;
    DateOfPurchase: Date=null;
    DepartmentName:string;
    DateOfLastInspection: Date=null;
    AccidentLog: boolean;
    StrategyLastMaintenanceId: number=0;
    AssetStatusId:number=0;
    UtilizationRateId:number=0;
    FrequentProblems:string;
    HistoricalCostsOfMaintenance:string;
    GuaranteeExpiryDate:Date=null;
    PriorityId:number=0;
    MaintenanceContractForAsset:string;    
    Evidence:string;
    AccidentDescription:string;
    IsActive:boolean;
}