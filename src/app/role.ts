export class Role {

    constructor() {
        this.name = '';
        this.display_name = '';
        this.permissions = [];
    }


    id: number; // 	Role's Id
    name: string; // optional   Role's Unique Name
    display_name: string; // optional   Role's Display Name
    permissions: number[];  // optional List of Permissions' IDs
}
