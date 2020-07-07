
export interface User {
    user_id?: number;
    name?: string;
    password?: string;
    email?: string;
    user_type?: number;
}

export interface Request{
    body: {
        user?: User;
    };
    params?: {
        
    };
    user?: User;
    isAuthenticated: boolean;
    logout?: {(): any;};
};
export interface UserInterface_BaseResponse{
    error: boolean;
    error_code?: number;
    error_message?: string;
    error_details?: string;
};
export interface GetUserStatus_ResPayload extends UserInterface_BaseResponse{
    user?: User;
    isAuthenticated: boolean;

};

export interface Response{
    json: {
        (payload: GetUserStatus_ResPayload|UserInterface_BaseResponse): any
    };
}

