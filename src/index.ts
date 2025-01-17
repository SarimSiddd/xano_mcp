import {xano} from '../src/api/xano/services/auth';
import {xano as xanoRequests} from '../src/api/xano/types/requests';

(async () => {
    try {
        const result = await xano.auth(xanoRequests.api_key);

        if (result.error != null)
        {
            console.log('Something went wrong:', result);
        }
        else
        {
            console.log('Printing access_token obj: ' , JSON.stringify(result.success?.extras.instance));
        }
    }
    catch (error)
    {
        console.log('Auth error:', error);
    }

})();


console.log('After async function call');