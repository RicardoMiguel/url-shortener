import { expect } from 'chai';
import { Url } from './url';
import {InvalidUrlError} from "./invalidUrlError";

describe('Url', function () {

    it('should throw when url provided is invalid', function () {
        //Given
        const urlString = 'random string as url';
        //When
        const url = () => new Url(urlString);
        //Then
        expect(url).to.throw(InvalidUrlError);
    });

    it('should create Url object when url provided is valid', function () {
        //Given
        const urlString = 'https://www.google.com:1234';
        //When
        const url = new Url(urlString);
        //Then
        expect(url.domain).to.equal('www.google.com');
    });

    describe('createHash', function () {
        beforeEach(function () {
            this.url = new Url('https://www.google.com:1234');
        });

        it('should create hash for client', function () {
            //Given
            const who = '127.0.0.1';
            //When
            const result = this.url.createHash(who, { create: (str: string) => `${str}_random` });
            //Then
            expect(this.url.whos).to.eql([ '127.0.0.1']);
            expect(this.url.hashes).to.eql(['www.google.com_random']);
            expect(result).to.equal('www.google.com_random');
        });

        it('should always create new hash for client', function () {
            //Given
            const who = '127.0.0.1';
            this.url.hashes = [ 'www.example.com_123456' ];
            this.url.whos = [ who ];
            //When
            const result = this.url.createHash(who, { create: (str: string) => `${str}_random` });
            //Then
            expect(this.url.whos).to.eql([ '127.0.0.1', '127.0.0.1']);
            expect(this.url.hashes).to.eql(['www.example.com_123456', 'www.google.com_random']);
            expect(result).to.equal('www.google.com_random');
        });
    });

});