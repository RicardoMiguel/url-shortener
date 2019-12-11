import { parse, UrlWithParsedQuery } from 'url'
import { InvalidUrlError } from './invalidUrlError';

export interface Hash {
    create(str: string): string
}

export class Url {
    readonly domain: string;
    readonly whos: string[];
    readonly hashes: string[];

    constructor(urlStr: string) {
            const parsedUrl: UrlWithParsedQuery = parse(urlStr, true);
            console.debug('Parsed received URL', urlStr, parsedUrl);
            if (parsedUrl.hostname === null) {
                throw new InvalidUrlError(`${urlStr} seems to be invalid. Please provide a proper url`);
            }
            this.domain = parsedUrl.hostname;
            this.hashes = [];
            this.whos = [];
    }

    createHash(who: string, algorithm: Hash) {
        const hash = algorithm.create(this.domain);
        console.debug(`Created hash ${hash} on domain ${this.domain} for ${who}`);
        this.whos.push(who);
        this.hashes.push(hash);

        return hash;
    }
}