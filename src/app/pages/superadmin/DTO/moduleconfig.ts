import { BaseDTO } from '../../basedto';
export class ModuleConfig extends BaseDTO {
    ModuleCnfgId: number;
    ModuleName: string;
    ParentModuleId: number = null;
    

}