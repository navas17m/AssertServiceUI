
import { BaseDTO } from '../../basedto';
export class ApprovedPanelMinutesDTO extends BaseDTO {
    ApprovedPanelMinutesId: number;
    CarerParentId: number;
    DateOfPanel: Date;
    ApprovalDate: Date;
    AgendaItems: string;
    PanelMinutes: string;
    FinalDecision: string;
    MakerMinutes: string;
    PanelApproval: string;
}