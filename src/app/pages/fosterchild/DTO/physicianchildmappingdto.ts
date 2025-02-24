
import { Common } from '../../common';
export class PhysicianChildMappingDTO {
    ChildId: number = null;
    ChildName: string;
    PhysicianInfoIds: string;
    PhysicianName: string;
    IsActive: boolean;
    CreatedUserId: number = parseInt(Common.GetSession("UserProfileId"));
    CreatedDate: Date;
}