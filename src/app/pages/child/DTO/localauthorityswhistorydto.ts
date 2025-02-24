
import { BaseDTO } from '../../basedto';

export class LocalAuthoritySWHistoryDTO extends BaseDTO {
    LocalAuthoritySWHistoryId: number = null;
    ChildId: number;
    LocalAuthoritySWInfoId: number = null;
    ChangedDate: Date;
    SWVisitDateHistory: LocalAuthoritySWVisitDateHistoryDTO[] = [];
    AddtoSiblingsRecord: boolean;
    AddtoParentChildRecord: boolean;
}

export class LocalAuthoritySWVisitDateHistoryDTO extends BaseDTO {
    LocalAuthoritySWVisitDateHistoryId: number;
    LocalAuthoritySWHistoryId: number;
    DateofLastVisit: Date;
    Comments: String;
    StatusId: number;
    IsActive: boolean;

}