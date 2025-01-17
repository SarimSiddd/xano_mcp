import { xano as XanoRequests } from '../types/requests';
import { xano as XanoResponses } from '../types/response';
import config from '../../../config';
import axios, { isAxiosError } from 'axios';

export namespace xano {

    const apiClient = axios.create({
        baseURL : `${config.xano.apiUrl}`,
        timeout : config.xano.timeout,
        headers : {
            'Content-Type' : 'application/json'
        }
    });

    /**
     * Authenticate with the Xano API
     * @param authToken - The authentication token
     * @returns Promise<AuthResult>
     */
    export async function auth(authToken: string): Promise<XanoResponses.AuthResult> {
        try {
            const response = await apiClient.get<XanoResponses.AuthSuccess>('/auth/me', {
                headers : {
                    'Authorization' : `Bearer ${config.xano.apiKey}`
                }
            });

            // Handle successful response
            return {
                success: response.data,
                error: null
            };

        } catch (error) {
            // Handle axios errors
            if (isAxiosError(error)) {

                let errorResp : XanoResponses.AuthError;

                if (error.response){
                    errorResp = {
                        ok : false,
                        description: error.response?.data?.message || 'Authentication failed',
                        code : error.response?.status?.toString()
                    }
                }
                else if (error.request)
                {
                    errorResp = {
                        ok : false,
                        description : error.cause?.message,
                        code : 'Request failed'
                    }
                }
                else {
                    errorResp = {
                        ok : false,
                        description : error.message,
                        code : 'Request failed'
                    }
                }

                return {
                    success: null,
                    error: errorResp
                };
            }

            return {
                success : null,
                error : {
                    ok : false,
                    description : 'Something unexpected happened'
                }
            };
        }
    }

}
