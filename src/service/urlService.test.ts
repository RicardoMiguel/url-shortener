import * as td from 'testdouble';
import { expect } from 'chai';
import { UrlService } from './urlService';
import { Repository, UrlNotFoundError } from '../infrastructure'
import {UrlDto} from "../infrastructure/repository";
import {InvalidUrlError, Url} from "../domain";

describe('UrlService', function () {
    beforeEach(function () {
        this.repository = td.object<Repository>();
        this.service = new UrlService(this.repository);
    });
    afterEach(() => td.reset());

    describe('getUrlBasedOnHash', function () {
        it('should throw if repository throws', function () {
            const hash = 'randomHash';
            td.when(this.repository.getByHash(hash))
                .thenReject(new UrlNotFoundError('Not found'));

            const promise = this.service.getUrlBasedOnHash(hash);

            return expect(promise).to.eventually.rejectedWith(UrlNotFoundError);
        });

        it('should return the url with no modification', async function () {
            const hash = 'randomHash';
            const object: UrlDto = { domain: 'www.example.com', whos: [ '127.0.0.1' ], hashes: [ hash ] };
            td.when(this.repository.getByHash(hash))
                .thenResolve(object);

            const url = await this.service.getUrlBasedOnHash(hash);

            expect(url).to.eql(object);
        });
    });

    describe('getStats', function () {
        it('should return all urls with no modification', async function () {
            const hash = 'randomHash';
            const object1: UrlDto = { domain: 'www.example.com', whos: [ '127.0.0.1' ], hashes: [ hash ] };
            const object2: UrlDto = { domain: 'www.example2.com', whos: [ '127.0.0.1' ], hashes: [ hash ] };
            td.when(this.repository.getAll()).thenResolve([ object1, object2 ]);

            const stats = await this.service.getAllStats();

            expect(stats).to.eql([ object1, object2 ]);
        });
    });

    describe('createOrUpdateUrl', function () {
        it('should throw if url is invalid', function () {
            const domain = 'random and invalid url';

            const promise = this.service.createOrUpdateUrl(domain, '127.0.0.1');

            expect(promise).to.rejectedWith(InvalidUrlError, 'random and invalid url seems to be invalid. Please provide a proper url');
        });

        it('should delegate creation to repository', async function () {
            const domain = 'https://www.example.com';
            const hash = 'randomHash';
            const object: UrlDto = { domain: 'www.example.com', whos: [ '127.0.0.1' ], hashes: [ hash ] };
            td.when(this.repository.updateOrCreateUrl(td.matchers.isA(Url)))
                .thenResolve(object);

            const hashCreated = await this.service.createOrUpdateUrl(domain, '120.0.0.1');

            expect(hashCreated).to.equal(hash);
        });
    });
});