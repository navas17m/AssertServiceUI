import { BaseDTO } from '../../basedto';
export class ConfigTableNamesDTO extends BaseDTO{
    ConfigTableNamesId: number;   
    ModuleCnfgId: number;
    Name: string;
    ParentTableId: number;    
}