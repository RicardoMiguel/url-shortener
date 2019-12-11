import { Repository } from '../infrastructure';
import { BasicHashAlgorithm } from './basicHashAlgorithm';
import {Url} from "../domain";

export class UrlService {
    private readonly repository: Repository;

    constructor(urlRepository: Repository) {
        this.repository = urlRepository;
    }

    getUrlBasedOnHash(hash: string) {
        return this.repository.getByHash(hash);
    }

    getAllStats() {
        return this.repository.getAll();
    }

    async createOrUpdateUrl(href: string, ip: string) {
        const url = new Url(href);

        const basicHash = new BasicHashAlgorithm();
        url.createHash(ip, basicHash);

        const urlDto = await this.repository.updateOrCreateUrl(url);
        console.info(`Created/Updated state for ${url.domain}: `, urlDto);
        return urlDto.hashes[urlDto.hashes.length - 1];
    }

    async clean() {
        const numbersUrlDeleted = await this.repository.deleteAll();
        console.info(`Cleaned ${numbersUrlDeleted} urls`);
        return numbersUrlDeleted;
    }
}