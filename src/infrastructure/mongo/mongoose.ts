/***
 * This is a first attempt to use mongoose. For some reason I couldn't figure out why
 * it was timing out when making a request to DB.
 */

// import {Schema, model, Document, createConnection, Model, Connection, connection} from 'mongoose';
//
// const schema = new Schema({
//     domain: {
//         type: String,
//         required: true,
//     },
//     whos: [{
//         type: String,
//     }],
//     hashes: [{
//         type: String,
//     }]
// });
//
// schema.index({ domain: 1 });
// schema.index({ hashes: 1 });
//
// const UrlModel = model<UrlDto & Document>('urlschema', schema);

// export class MongoRepository implements Repository {
//     getAll(): Promise<UrlDto[]> {
//         return UrlModel.find().lean().exec();
//     }
//
//     getByHash(hash: string): Promise<UrlDto> {
//         return UrlModel.findOne({ hashes: hash }).lean().exec();
//     }
//
//     updateOrCreateUrl(url: Url): Promise<UrlDto> {
//         return UrlModel.findOneAndUpdate(
//             { domain: url.domain },
//             { $set: { $push: { whos: { $each: url.whos }, hashes: { $each: url.hashes } } } },
//             { upsert: true, new: true }
//         )
//             .lean()
//             .exec();
//     }
// }