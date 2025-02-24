/// <reference path="configtablevalues.ts" />
import { BaseDTO } from '../../basedto';
import { ConfigTableNamesDTO } from './configtablename';
import { ConfigTableValuesDTO } from './configtablevalues';

export class ComplianceCheckTypeCnfgDTO extends BaseDTO {
    CheckTypeId: number;
    MemberTypeId: number;
    CheckName: string;
    FieldIdCSV: string;
    ConfigTableNames: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    ConfigTableValues: ConfigTableValuesDTO = new ConfigTableValuesDTO();
    IsAnnualReview: boolean;
    OrderBy: number;
    GridOrderBy: number;
    SourceFieldName: string;
    TargetFieldName: string;
    RenewalDaysDifferent: number;
}