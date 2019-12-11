import * as td from 'testdouble';
import { expect } from 'chai';
import {UrlService} from "../service/urlService";
import getUrl from "./getUrl";
import {UrlNotFoundError} from "../infrastructure";

describe('getUrl', function () {
    beforeEach(function () {
        this.urlService = td.object<UrlService>();
        this.event = {};
    });

    afterEach(()=> td.reset());

    it('should return 400 code when there is no query string', async function () {
        this.event.queryStringParameters = undefined;

        const result = await getUrl(this.event, this.urlService);

        expect(result).to.eql({
            statusCode: 400,
            body: 'Please specify a hash through query parameters'
        });
    });

    it('should return 400 code when there is empty url query string parameter', async function () {
        this.event.queryStringParameters = { hash: '' };

        const result = await getUrl(this.event, this.urlService);

        expect(result).to.eql({
            statusCode: 400,
            body: 'Please specify a hash through query parameters'
        });
    });

    it('should return 404 when system was not able to find url', async function () {
        this.event.queryStringParameters = { hash: 'abc12345' };
        td.when(this.urlService.getUrlBasedOnHash('abc12345'))
            .thenReject(new UrlNotFoundError('Not found'));

        const result = await getUrl(this.event, this.urlService);

        expect(result).to.eql({
            statusCode: 404,
            body: 'Not found'
        });
    });

    it('should return 500 error when unexpected error happens', async function () {
        this.event.queryStringParameters = { hash: 'abc12345' };
        td.when(this.urlService.getUrlBasedOnHash('abc12345'))
            .thenReject(new Error('Unexpected error'));

        const result = await getUrl(this.event, this.urlService);

        expect(result).to.eql({
            statusCode: 500,
            body: "Unexpected error"
        });
    });

    it('should return 200 when creates correctly', async function () {
        const object = { domain: 'www.google.com', hashes: [ 'abc12345' ], whos: ['localhost'] };
        this.event.queryStringParameters = { hash: 'abc12345' };
        td.when(this.urlService.getUrlBasedOnHash('abc12345'))
            .thenResolve(object);

        const result = await getUrl(this.event, this.urlService);

        expect(result).to.eql({
            statusCode: 200,
            body: JSON.stringify(object)
        });
    });

});