export type Admin = {
    id: number | null,
    full_name: string,
    username: string,
    email?: string,
    password: string,
    enabled: boolean,
    locked: boolean,
    //Falta user_roles
    user_roles: [
        {
          role: string
        }
    ]
}

export const emptyAdmin  = {
    id: null,
    full_name: "",
    username: "",
    email: "",
    password: "",
    enabled: true,
    locked: false,
    //Falta user_roles
    user_roles: [{role:""}]
};

