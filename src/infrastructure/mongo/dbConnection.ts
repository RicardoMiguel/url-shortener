import {Db, MongoClient} from "mongodb";

let cachedDb: Db;

export async function connect () : Promise<Db> {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        const msg = 'MONGO_URI must be defined in order to this function to work. Exiting...';
        console.error(msg);
        throw new Error(msg);
    }

    if (!cachedDb) {
        console.trace('Connecting to database');
        const connection = await MongoClient.connect(uri);
        cachedDb = connection.db();
    }

    return cachedDb;
}