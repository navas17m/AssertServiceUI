
import { BaseDTO } from '../../basedto';
import { FieldDataTypeCnfg } from './fielddatatypeconfig';
import { FormConfig } from './formconfig';

export class FieldConfig extends BaseDTO {
    FieldCnfgId: number;
    FieldName: string;
    IsMandatory: number;
    FieldLength: number;
    DisplayName: string;
   
   
    FieldDataTypeCnfg: FieldDataTypeCnfg = new FieldDataTypeCnfg();
    FormCnfg: FormConfig = new FormConfig();

}