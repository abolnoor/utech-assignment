import { RoleTypes } from './role.enum';

export class UserAuth {
    token: string;
    user: object;
    permissions: string[];
    role: RoleTypes;
}
