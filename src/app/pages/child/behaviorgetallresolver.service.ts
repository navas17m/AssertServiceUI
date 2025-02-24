
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Common } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames';

@Injectable()
export class BehaviourGetAllResolver implements Resolve<any> {

    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    constructor(private apiService: APICallService) {
    }
    resolve() {
        this.objConfigTableNamesDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Behavioral;
        return this.apiService.post("ConfigTableValues","GetByTableNamesId",this.objConfigTableNamesDTO);
    }
}
