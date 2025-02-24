import { BaseDTO } from '../basedto';

export class UserSecretQustionInfoDTO extends BaseDTO {
    UserSecretQustionId: number;
    UserProfileId: number;
    SecretQustionId: number;
    SecretQustion: string;
    SecretQustionAnswer: string;
}
