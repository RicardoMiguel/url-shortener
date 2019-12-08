import {Repository, UrlDto} from "./repository";
import {UrlNotFoundError} from "./urlNotFoundError";
import {Url} from "../domain";

export class MemoryRepository implements Repository {
    readonly repository: UrlDto[] = [];

    async getAll(): Promise<UrlDto[]> {
        return this.repository;
    }

    async getByHash(hash: string): Promise<UrlDto> {
        const url = this.repository.find((x: UrlDto) => x.hashes.find((y: string) => y === hash) );
        if (!url) {
            throw new UrlNotFoundError(`Url with '${hash}' hash has't been found`);
        }
        return url;
    }

    async updateOrCreateUrl(url: Url): Promise<UrlDto> {
        const foundUrl: UrlDto | undefined = this.repository.find((x: UrlDto) => x.domain === url.domain);
        if (!foundUrl) {
            this.repository.push(url);
        } else {
            foundUrl.whos.push(...url.whos);
            foundUrl.hashes.push(...url.hashes);
        }

        return foundUrl || url;
    }
}
