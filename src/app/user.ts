export class User {

    constructor() {
        this.first_name = '';
        this.last_name = '';
        this.email = '';
        this.mobile_number = '';
        this.password = '';
        this.roles = [];
    }


    id: number; // User's ID
    first_name: string; // optional User's First Name
    last_name: string; // optional  User's Last Name
    email: string; // optional  User's Unique Email
    mobile_number: string; // optional	User's Mobile Number
    password: string;   // optional User's Password
    roles: number[];    // optional List of Active Roles' IDs
}
