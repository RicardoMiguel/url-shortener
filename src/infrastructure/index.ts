import { Repository } from './repository';
import { MemoryRepository } from './memoryRepository';
import { UrlNotFoundError } from './urlNotFoundError';

const UrlRepository = MemoryRepository;

export {
    Repository,
    UrlRepository,
    UrlNotFoundError
}