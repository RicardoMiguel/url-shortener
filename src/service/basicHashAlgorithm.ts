import { Hash } from '../domain/url';

export class BasicHashAlgorithm implements Hash {
    create(str: string): string {
        return Math.random().toString(36).substring(7);
    }
}