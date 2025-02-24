export class UserCarerMappingDTO {
    UserProfileId: number = null;
    CarerParentId: number;
    CarerParentIds: string;
    ExpiryDate: Date;
    CarerCode: string;
    PCFullName: string;
    SCFullName: string;
    DateOfBirth: Date;
    IsActive: boolean;
    CreatedUserId: number;
    CreatedDate: Date;
}