export class User {



    id: number;
    username: string;
    roles: string[];
    tag: Tag;
    unverified: boolean;
    blocked: boolean;
    admin: boolean;
    goodUser: boolean;
    goodAdmin: boolean;
}

export class Tag {
    name: string;
}
