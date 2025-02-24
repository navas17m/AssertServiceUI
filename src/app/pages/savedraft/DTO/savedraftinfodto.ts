import { BaseDTO } from '../../basedto';

export class SaveDraftInfoDTO extends BaseDTO {
    SaveAsDraftId: number;
    JsonList: string;
    JsonData: string;
    SequenceNo: number;
    UserTypeCnfgId: number;
    TypeId: number;
    CarerParentId: number;
}