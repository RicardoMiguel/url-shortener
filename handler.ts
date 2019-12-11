import { APIGatewayProxyEvent, Context } from "aws-lambda";
import {connect, UrlRepository} from './src/infrastructure'
import * as functions from './src/functions';
import {UrlService} from "./src/service/urlService";

const databaseConnection = connect;

const getUrl = async (event: APIGatewayProxyEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const db = await databaseConnection();
    const urlService = new UrlService(new UrlRepository(db));

    return await functions.getUrl(event, urlService);
};

const getStats = async (event: APIGatewayProxyEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const db = await databaseConnection();
    const urlService = new UrlService(new UrlRepository(db));
    
    return await functions.getStats(urlService);
};

const createUrl = async (event: APIGatewayProxyEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const db = await databaseConnection();
    const urlService = new UrlService(new UrlRepository(db));

    return await functions.createUrl(event, urlService);
};

const cleanUrls = async (event: unknown, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const db = await databaseConnection();
    const urlService = new UrlService(new UrlRepository(db));

    await functions.cleanUrls(urlService);
};

export { getUrl, getStats, createUrl, cleanUrls };