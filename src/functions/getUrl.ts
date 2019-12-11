import {UrlService} from "../service/urlService";
import {UrlNotFoundError} from "../infrastructure";
import {APIGatewayProxyEvent} from "aws-lambda";

export default async function (event: APIGatewayProxyEvent, urlService: UrlService) {
    const hash: string | null = event.queryStringParameters && event.queryStringParameters['hash'];
    if (!hash) {
        return { statusCode: 400, body: 'Please specify a hash through query parameters' };
    }

    try {
        const url = await urlService.getUrlBasedOnHash(hash);
        return { statusCode: 200, body: JSON.stringify(url) };
    } catch (e) {
        if (e instanceof UrlNotFoundError) {
            return { statusCode: 404, body: e.message };
        }
        return { statusCode: 500, body: e.message };
    }
}