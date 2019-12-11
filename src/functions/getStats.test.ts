import * as td from 'testdouble';
import { expect } from 'chai';
import {UrlService} from "../service/urlService";
import getStats from "./getStats";

describe('getStats', function () {
    beforeEach(function () {
        this.urlService = td.object<UrlService>();
    });

    afterEach(()=> td.reset());

    it('should return all urls', async function () {
        td.when(this.urlService.getAllStats())
            .thenResolve([]);

        const number = await this.urlService.getAllStats();

        expect(number).to.eql([]);
    });
});