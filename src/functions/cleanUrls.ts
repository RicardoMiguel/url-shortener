import {UrlService} from "../service/urlService";

export default async function (urlService: UrlService) {
    try {
        const numberUrlsCleaned = await urlService.clean();
        console.info(`Removed ${numberUrlsCleaned} urls`);
        return numberUrlsCleaned;
    } catch (e) {
        console.error(e);
        throw e;
    }
}