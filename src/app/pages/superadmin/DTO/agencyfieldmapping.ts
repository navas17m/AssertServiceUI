import { BaseDTO } from '../../basedto';
import { FieldConfig } from './fieldconfig';
export class AgencyFieldMapping extends BaseDTO {
    AgencyProfileId: number;
    FormCnfgId: number;
    FieldCnfg: FieldConfig = new FieldConfig();
    ConfigTableName: string;
    OriginalConfigTableName: string;
    ConfigTableNamesId: number;
    OriginalConfigTableNamesId: number;
    DisplayName: string;
    OriginalDisplayName: string;
    FieldOrder: number;
    OriginalFieldOrder: number;
    IsMandatory: boolean;
    OriginalIsMandatory: boolean;
    OriginalIsActive: boolean;
    IsVisible: boolean = true;
    IsDisabled: boolean = true;
    ConfigTableValues: any[] = [];
    FieldValue: string;
    GridDisplayField: string;
    ImageString: string;
    ImageVisible: boolean = false;
}