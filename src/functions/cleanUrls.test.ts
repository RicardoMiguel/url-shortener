import * as td from 'testdouble';
import { expect } from 'chai';
import {UrlService} from "../service/urlService";
import cleanUrls from "./cleanUrls";

describe('cleanUrls', function () {
    beforeEach(function () {
        this.urlService = td.object<UrlService>();
    });

    afterEach(() => td.reset());

    it('should return number of urls cleaned', async function () {
        td.when(this.urlService.clean())
            .thenResolve(5);

        const number = await cleanUrls(this.urlService);

        expect(number).to.equal(5);
    });

    it('should re-throw any error', function () {
        td.when(this.urlService.clean())
            .thenReject(new Error('Error'));

        const promise = cleanUrls(this.urlService);

        return expect(promise).to.eventually.rejectedWith(Error);
    });
});