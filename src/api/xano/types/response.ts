export namespace xano {

    export interface AuthError {
        ok ?: false;
        description? : string;
        code ?: string;
    }

    export interface AuthSuccess {
        id : number;
        name : string;
        email : string;
        extras : {
            instance : {
                workspace : [{
                    id : number;
                    guid : string;
                }]
            }
            expires_at : string;
        },
    }

    export type Result<Success, Failure> = {
        success: Success | null,
        error  : Failure | null,
    };

    export type AuthResult = Result<AuthSuccess, AuthError>;

}