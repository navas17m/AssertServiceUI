import { BaseDTO } from '../../basedto';
export class ConfigTableValuesDTO extends BaseDTO {
    CofigTableValuesId: number;
    ConfigTableNamesId: number;
    Value: string;
    IsApproved: boolean;
    ValueOrder: number;
    IsDefault: boolean;
    ParentId: number;
    ParentValue: string;
    IsEdit: boolean;
    ComplianceCheckFieldOrderMapping: ComplianceCheckFieldOrderMappingDTO = new ComplianceCheckFieldOrderMappingDTO();
}
export class ComplianceCheckFieldOrderMappingDTO {
    FieldOrderMappingId: number;
    ComplianceCheckId: number;
    FieldCnfgId: number;
    OrderBy: number;
}

