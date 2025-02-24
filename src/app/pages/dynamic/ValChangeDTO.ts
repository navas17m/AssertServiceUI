import { AgencyFieldMapping } from '../superadmin/DTO/agencyfieldmapping';
export class ValChangeDTO {

    currnet: AgencyFieldMapping;
    all: AgencyFieldMapping[];
    oldValue: any;
    newValue: any;
    IsVisible = true;

}

export class ConfigTableValues {
    CofigTableValuesId: number;
    Value: string;

}