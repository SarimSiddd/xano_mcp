import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path : path.resolve (__dirname, '../.env')});

interface Config {
    xano : {
        apiKey : string;
        apiUrl : string;
        timeout : number;
    };
    env : string;
}

function validateEnv (envVar : string) : string{
    const value = process.env[envVar];

    if (!value)
    {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }

    return value;
}

const config : Config = {
    xano : {
        apiKey: validateEnv('XANO_API_KEY'),
        apiUrl: validateEnv('XANO_API_URL'),
        timeout: parseInt(process.env.API_TIMEOUT || '10000', 10),
    },
    env: process.env.NODE_ENV || 'development',
};

export default Object.freeze(config);

export function isProduction() : boolean {
    return config.env == 'production';
}

export function isDeveloper() : boolean {
    return config.env == 'development';
}
