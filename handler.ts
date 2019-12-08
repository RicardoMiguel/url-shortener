import { UrlService } from './src/service/urlService'
import {UrlNotFoundError, UrlRepository, connect} from './src/infrastructure'
import {APIGatewayProxyEvent, Context} from "aws-lambda";
import {InvalidUrlError} from "./src/domain";

interface IncomingUrl {
    url: string;
}

async function databaseConnection () {
    await connect();
}

const getUrl = async (event: APIGatewayProxyEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await databaseConnection();

    const hash: string | null = event.queryStringParameters && event.queryStringParameters['hash'];
    if (hash === null || hash === '') {
        return { statusCode: 400, body: 'Please specify a hash through query parameters' };
    }

    const urlService = new UrlService(new UrlRepository());
    try {
        const url = await urlService.getUrlBasedOnHash(hash);
        return { statusCode: 200, body: JSON.stringify(url) };
    } catch (e) {
        if (e instanceof UrlNotFoundError) {
            return { statusCode: 404, body: e.message };
        }
        return { statusCode: 500, body: e.message };
    }
};

const getStats = async (event: APIGatewayProxyEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await databaseConnection();
    
    const urlService = new UrlService(new UrlRepository());
    const urls = await urlService.getAllStats();
    return { statusCode: 200, body: JSON.stringify(urls) };
};

const createUrl = async (event: APIGatewayProxyEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await databaseConnection();

    if (!event.body) {
        return { statusCode: 400, body: 'Please specify a body' };
    }
    const incomingUrl: IncomingUrl = JSON.parse(event.body);
    if (!incomingUrl.url) {
        return { statusCode: 400, body: 'Please specify a hash through \'url\' body property' };
    }

    const host = event.multiValueHeaders.Host[0];
    const urlService = new UrlService(new UrlRepository());
    try {
        const url = await urlService.createOrUpdateUrl(incomingUrl.url, host);
        return { statusCode: 200, body: JSON.stringify(url) };
    } catch (e) {
        if (e instanceof InvalidUrlError) {
            return { statusCode: 400, body: e.message };
        }
        return { statusCode: 500, body: e.message };
    }
};

export { getUrl, getStats, createUrl };