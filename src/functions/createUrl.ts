import {UrlService} from "../service/urlService";
import {InvalidUrlError} from "../domain";
import {APIGatewayProxyEvent} from "aws-lambda";

interface IncomingUrl {
    url: string;
}

export default async function (event: APIGatewayProxyEvent, urlService: UrlService) {
    if (!event.body) {
        return { statusCode: 400, body: 'Please specify a body' };
    }
    const incomingUrl: IncomingUrl = JSON.parse(event.body);
    if (!incomingUrl.url) {
        return { statusCode: 400, body: 'Please specify a hash through \'url\' body property' };
    }

    const host = event.multiValueHeaders.Host[0];
    try {
        const hash = await urlService.createOrUpdateUrl(incomingUrl.url, host);
        return { statusCode: 200, body: hash };
    } catch (e) {
        if (e instanceof InvalidUrlError) {
            return { statusCode: 400, body: e.message };
        }
        return { statusCode: 500, body: e.message };
    }
}