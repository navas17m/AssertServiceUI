import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Common } from '../common';

export class Base {
    static GetHeader() {
        //   let userId = 3;
        let carerparentId = Common.GetSession("CarerParentId");
        let agencyId = Common.GetSession("AgencyProfileId");
        let userId = Common.GetSession("UserProfileId");
        let LoginId = Common.GetSession("LoginId");
        let pwd = Common.GetSession("UserPwd");
        let Token = Common.GetSession("Token");
         //headers.append('Authorization', 'Basic ' + btoa(LoginId + ':' + pwd + ':' + agencyId));
         //Basic
         let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'AgencyID': '' + agencyId + '', 'UserId': '' + userId + '', 'CarerParentId': '' + carerparentId + '', 'Authorization': 'Basic ' + btoa(LoginId + ':' + pwd + ':' + agencyId) });
        //jwt
        //let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'AgencyID': '' + agencyId + '', 'UserId': '' + userId + '', 'CarerParentId': '' + carerparentId + '', 'Authorization': 'Bearer ' +Token });

        const options = { headers: headers};
        return options;
    }
    static GetUrl() {
        return environment.api_url;
    }
}
