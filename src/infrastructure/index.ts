import { Repository } from './repository';
import { UrlNotFoundError } from './urlNotFoundError';
import {MongoRepository, connect} from "./model";

const UrlRepository = MongoRepository;

export {
    Repository,
    UrlRepository,
    UrlNotFoundError,
    connect
}