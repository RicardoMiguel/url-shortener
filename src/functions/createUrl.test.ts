import * as td from 'testdouble';
import { expect } from 'chai';
import {UrlService} from "../service/urlService";
import createUrl from "./createUrl";
import {InvalidUrlError} from "../domain";

describe('createUrl', function () {
    beforeEach(function () {
        this.urlService = td.object<UrlService>();
        this.event = {};
    });

    afterEach(()=> td.reset());

    it('should return 400 error when there is no body', async function () {
        this.event.body = null;

        const result = await createUrl(this.event, this.urlService);

        expect(result).to.eql({
            statusCode: 400,
            body: 'Please specify a body'
        });
    });

    it('should return 400 error when url is not specified in body', async function () {
        const body = { aProperty: 'something' };
        this.event.body = JSON.stringify(body);

        const result = await createUrl(this.event, this.urlService);

        expect(result).to.eql({
            statusCode: 400,
            body: "Please specify a hash through 'url' body property"
        });
    });

    it('should return 400 error when url is invalid', async function () {
        const body = { url: 'https://google.com' };
        this.event.body = JSON.stringify(body);
        this.event.multiValueHeaders = { Host: [ 'localhost' ] };
        td.when(this.urlService.createOrUpdateUrl('https://google.com', 'localhost'))
            .thenReject(new InvalidUrlError('Invalid url'));

        const result = await createUrl(this.event, this.urlService);

        expect(result).to.eql({
            statusCode: 400,
            body: "Invalid url"
        });
    });

    it('should return 500 error when unexpected error happens', async function () {
        const body = { url: 'https://google.com' };
        this.event.body = JSON.stringify(body);
        this.event.multiValueHeaders = { Host: [ 'localhost' ] };
        td.when(this.urlService.createOrUpdateUrl('https://google.com', 'localhost'))
            .thenReject(new Error('Unexpected error'));

        const result = await createUrl(this.event, this.urlService);

        expect(result).to.eql({
            statusCode: 500,
            body: "Unexpected error"
        });
    });

    it('should return 200 when creates correctly', async function () {
        const body = { url: 'https://google.com' };
        this.event.body = JSON.stringify(body);
        this.event.multiValueHeaders = { Host: [ 'localhost' ] };
        td.when(this.urlService.createOrUpdateUrl('https://google.com', 'localhost'))
            .thenResolve('abc12345');

        const result = await createUrl(this.event, this.urlService);

        expect(result).to.eql({
            statusCode: 200,
            body: "abc12345"
        });
    });
});