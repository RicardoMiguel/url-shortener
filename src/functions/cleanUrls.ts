import {UrlService} from "../service/urlService";

export default async function (urlService: UrlService) {
    try {
        return await urlService.clean();
    } catch (e) {
        console.error(e);
        throw e;
    }
}