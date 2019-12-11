import {UrlService} from "../service/urlService";

export default async function (urlService: UrlService) {
    const urls = await urlService.getAllStats();
    return { statusCode: 200, body: JSON.stringify(urls) };
}