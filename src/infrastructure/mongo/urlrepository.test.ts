import * as td from 'testdouble';
import { expect } from 'chai';
import {Collection, Cursor, Db} from "mongodb";
import {UrlDto} from "../repository";
import { UrlRepository } from './urlRepository';
import {UrlNotFoundError} from "../urlNotFoundError";
import {Url} from "../../domain";
import {BasicHashAlgorithm} from "../../service/basicHashAlgorithm";

describe('UrlRepository', function () {
    beforeEach(function () {
        const db = td.object<Db>();
        this.collection = td.object<Collection>();
        td.when(db.collection<UrlDto>('url')).thenReturn(this.collection);

        this.repository = new UrlRepository(db);
    });
    afterEach(() => td.reset());

    describe('getByHash', function () {
        it('should throw when there is no document', function () {
            const hash = 'randomHash';
            td.when(this.collection.findOne({ hashes: hash })).thenResolve(null);

            const promise = this.repository.getByHash(hash);

            return expect(promise).to.eventually.rejectedWith(UrlNotFoundError, 'Not found url with randomHash');
        });

        it('should return the document', async function () {
            const hash = 'randomHash';
            const object: UrlDto = { domain: 'www.example.com', whos: [ '127.0.0.1' ], hashes: [ hash ] };
            td.when(this.collection.findOne({ hashes: hash })).thenResolve(object);

            const result = await this.repository.getByHash(hash);
            expect(result).to.eql(object);
        });
    });

    describe('getAll', function () {
        it('should return all documents', async function () {
            const cursor = td.object<Cursor<UrlDto>>();
            td.when(this.collection.find()).thenReturn(cursor);
            td.when(cursor.toArray()).thenResolve([]);

            const result = await this.repository.getAll();

            expect(result).to.eql([]);
        });
    });

    describe('updateOrCreateUrl', function () {
        beforeEach(function () {
           this.url = new Url('http://www.example.com');
           this.url.createHash('127.0.0.1', new BasicHashAlgorithm());
        });

        it('should throw when there database returns error', function () {
            const hash = 'randomHash';
            // const object: UrlDto = { domain: 'www.example.com', whos: [ '127.0.0.1' ], hashes: [ hash ] };

            td.when(this.collection.findOneAndUpdate(
                { domain: 'www.example.com' },
                { $push: { whos: { $each: ['127.0.0.1'] }, hashes: { $each: this.url.hashes } } },
                { upsert: true, returnOriginal: false }
            )).thenResolve({ lastErrorObject: { errmsg: 'Duplicated' } });

            const promise = this.repository.updateOrCreateUrl(this.url);

            return expect(promise).to.eventually.rejectedWith(Error, 'Duplicated');
        });

        it('should throw when there is no document returned', async function () {
            const hash = 'randomHash';
            const object: UrlDto = { domain: 'www.example.com', whos: [ '127.0.0.1' ], hashes: [ hash ] };

            td.when(this.collection.findOneAndUpdate(
                { domain: 'www.example.com' },
                { $push: { whos: { $each: this.url.whos }, hashes: { $each: this.url.hashes } } },
                { upsert: true, returnOriginal: false }
                )).thenResolve({ ok: 1, value: object });

            const result = await this.repository.updateOrCreateUrl(this.url);

            expect(result).to.eql(object);
        });
    });
});