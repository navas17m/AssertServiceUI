
import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';
import { BackupCarerInfoDTO } from './backupcarerinfo';
export class BackupCarerDTO extends BaseDTO {
    IsDocumentExist: boolean;
    UniqueID: number;
    BackupCarerDetailsId: number;
    CarerId: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    SequenceNo: number;
    BackupCarerInfo: BackupCarerInfoDTO = new BackupCarerInfoDTO();
    DynamicValue: DynamicValue = new DynamicValue();
    DynamicControls = [];
    DraftSequenceNo: number;
    StatusId:number;
    AgreedToBeBackupCarer:boolean;
}
