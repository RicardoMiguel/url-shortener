import {Url} from "../domain";

export interface UrlDto {
    domain: string;
    whos: string[];
    hashes: string[];
}

export interface Repository {
    getByHash(hash: string): Promise<UrlDto>;
    getAll(): Promise<UrlDto[]>;
    updateOrCreateUrl(url: Url): Promise<UrlDto>;
}