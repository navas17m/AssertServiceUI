import { BaseDTO } from '../../basedto';
import { ModuleConfig } from './moduleconfig';

export class FormConfig extends BaseDTO {
  //  FormCnfgId: number = null;
    FormName: string;
    Pattern: string;
    ModuleCnfgId: number;
    ModuleCnfg: ModuleConfig = new ModuleConfig();

}