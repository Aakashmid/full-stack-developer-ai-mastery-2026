

// request data types

export interface SignupPayload {
    username: string;
    email: string;
    password: string
};


export interface SigninPayload  {
    username_or_email: string;
    password: string
};

