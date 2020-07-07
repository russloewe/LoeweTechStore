import {User} from './userInterface';
import {ErrorCode} from './baseTypes';

export interface ClientRequest{
    session?: {
        gcapscore?: number | string;
    };
    body?: any;
    connection?: {
        remoteAddress: string | number;
    };
    header?: any;
    isAuthenticated?: boolean ;
    user?: User;
};

export interface AdminRequest{
    session?: {
        gcapscore?: number | string;
    };
    body?: any;
    connection: {
        remoteAddress: string | number;
    };
    header: any;
    isAuthenticated: boolean ;
    user?: User;
}
export interface ServerResponse{
    sendStatus: {
        (code: number): any;
    };
}
export interface HTTPErrorResponse{
    code: ErrorCode;
    description: string;
    err_desc?: string;
};
export const postHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
};