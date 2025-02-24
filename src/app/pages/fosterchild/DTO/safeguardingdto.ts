import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';

export class SafeguardingDTO extends BaseDTO {
    UniqueID: any;
    ChildId: any;
    FieldCnfgId: any;
    FieldValue: string;
    SequenceNo: any;
    DynamicValue: DynamicValue = new DynamicValue();
}

export class ChildHolidayRiskAssessmentDTO extends BaseDTO {
    UniqueID: any;
    ChildId: any;
    FieldCnfgId: any;
    FieldValue: string;
    SequenceNo: any;
    ControlLoadFormat: string[];
    DynamicValue: DynamicValue[] = [];
}

export class RiskFactorDTO extends BaseDTO  {
    ChildRiskFactorsId:any;
    ChildId:any;
    DateofAssessment: Date = null;
    DeviantSexualInterests:any;
    SexualInterests:any;
    AttitudesSupportive:any;
    Unwillingness:any;
    EverSexuallyAssaulted2:any;
    EverSexuallyAssaultedSame:any;
    PriorAdultSanctions:any;
    Threats:any;
    SexuallyAssaultedChild:any;
    SexuallyAssaultedStranger:any;
    Indiscriminate:any;
    MaleOffenderOnly:any;
    DiverseSexual:any;
    AntisocialInterpersonal:any;
    LackofIntimate:any;
    NegativePeerAssociations:any;
    InterpersonalAggression:any;
    RecentEscalation:any;
    PoorSelf:any;
    HighStressFamily:any;
    ProblematicParentOffender:any;
    ParentNotSupporting:any;
    EnvironmentSupporting:any;
    NoDevelopment:any;
    IncompleteSexual:any;
    OtherFactor:any;
    OverallRiskRating:any;
}
