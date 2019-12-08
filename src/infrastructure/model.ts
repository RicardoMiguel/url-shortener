import {Schema, model, Document, createConnection, Model, Connection} from 'mongoose';
import {Repository, UrlDto} from "./repository";
import {Url} from "../domain";

const schema = new Schema({
    domain: {
        type: String,
        required: true,
    },
    whos: [{
        type: String,
    }],
    hashes: [{
        type: String,
    }]
});

schema.index({ domain: 1 });
schema.index({ hashes: 1 });

const UrlModel = model<UrlDto & Document>('urlschema', schema);


export class MongoRepository implements Repository {
    getAll(): Promise<UrlDto[]> {
        return UrlModel.find().lean().exec();
    }

    getByHash(hash: string): Promise<UrlDto> {
        return UrlModel.findOne({ hashes: hash }).lean().exec();
    }

    updateOrCreateUrl(url: Url): Promise<UrlDto> {
        return UrlModel.findOneAndUpdate(
            { domain: url.domain },
            { $set: { $push: { whos: { $each: url.whos }, hashes: { $each: url.hashes } } } },
            { upsert: true, new: true }
        )
            .lean()
            .exec();
    }

}
let conn: Connection;
export async function connect () {
    if (!conn) {
        const uri = 'mongodb://admin:admin@etergo-shard-00-00-doumq.mongodb.net:27017,etergo-shard-00-01-doumq.mongodb.net:27017,etergo-shard-00-02-doumq.mongodb.net:27017/test?ssl=true&replicaSet=Etergo-shard-0&authSource=admin&retryWrites=true&w=majority'
        conn = await createConnection(uri, {
            // Buffering means mongoose will queue up operations if it gets
            // disconnected from MongoDB and send them when it reconnects.
            // With serverless, better to fail fast if not connected.
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // and MongoDB driver buffering
            useNewUrlParser: true
        });
        console.trace('Successfully connected to DB');
    }
}