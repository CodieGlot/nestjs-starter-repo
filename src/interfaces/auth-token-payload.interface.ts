import type { AuthToken, UserRole } from '../constants';

export interface IAuthTokenPayload {
    userId: string;
    role: UserRole;
    type: AuthToken;
}
