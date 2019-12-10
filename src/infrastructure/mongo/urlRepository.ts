import {Collection, Db} from 'mongodb';
import { Repository, UrlDto } from "../repository";
import { UrlNotFoundError } from "../urlNotFoundError";
import { Url } from "../../domain";

const COLLECTION_NAME = 'url';

export class UrlRepository implements Repository {
    private readonly collection: Collection<UrlDto>;

    constructor(db: Db) {
        this.collection = db.collection<UrlDto>(COLLECTION_NAME);

        this.collection.createIndexes([
            { name: 'domain_1', key: { domain: 1 } },
            { name: 'hashes_1', key: {hashes: 1} }
        ])
    }

    getAll(): Promise<UrlDto[]> {
        return this.collection.find().toArray();
    }

    async getByHash(hash: string): Promise<UrlDto> {
        const url = await this.collection.findOne({ hashes: hash });
        if (url === null) {
            throw new UrlNotFoundError('Not found url with ' + hash);
        }
        console.debug('Url object: ', url);
        return url;
    }

    async updateOrCreateUrl(url: Url): Promise<UrlDto> {
        const result = await this.collection.findOneAndUpdate(
            { domain: url.domain },
            { $push: { whos: { $each: url.whos }, hashes: { $each: url.hashes } } },
            { upsert: true, returnOriginal: false }
        );
        if (!result.value || !result.ok) {
            throw Error(result.lastErrorObject.errmsg);
        }
        console.debug('Url object: ', result.value);
        return result.value;
    }

    async deleteAll(): Promise<number> {
        const result = await this.collection.deleteMany({});
        if (!result.result.ok || result.result.n === undefined) {
            throw new Error('Something unexpected happened while deleting.');
        }
        return result.result.n;
    }
}