import { BaseDTO} from  '../../basedto'

export class CarerAssessorTrackDTO extends BaseDTO {
    CarerAssessorTrackId: number;
    CarerParentId: number;
    AssessorName: string;
    AssessmentAllocatedDate: Date=null;
    Fee: string;
    AssessorDateSent: Date=null;
    AssessorDateReceived: Date=null;
    TransferDateSent:Date=null;
    FormFDateSent:Date=null;
    CompletionDate:Date=null;
    PanelDate:Date=null;
    Telephone: string;
    EmailId: string;
}