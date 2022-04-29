"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDataPersistence = void 0;
const magazines_json_1 = __importDefault(require("./data/magazines.json"));
const reviews_json_1 = __importDefault(require("./data/reviews.json"));
const tags_json_1 = __importDefault(require("./data/tags.json"));
const Connection_1 = require("../Connection");
const mongodb_1 = require("mongodb");
async function checkDataPersistence() {
    const connection = await (Connection_1.Connection.getInstance().connect());
    console.log('opened conncetion');
    let collections = await (connection.listCollections().toArray());
    if (collections.length !== 0) {
        await (connection.collection(process.env.DB_TAGS_COLLECTION).drop());
        await (connection.collection(process.env.DB_REVIEWS_COLLECTION).drop());
        await (connection.collection(process.env.DB_MAGAZINE_COLLECTION).drop());
        console.log('removed databases');
    }
    console.log(collections.length);
    collections = await (connection.listCollections().toArray());
    if (collections.length === 0) {
        const tagis = Array();
        for (let tag of tags_json_1.default) {
            tagis.push(new mongodb_1.ObjectId(tag._id));
        }
        const revis = Array();
        for (let review of reviews_json_1.default) {
            revis.push(new mongodb_1.ObjectId(review._id));
        }
        for (let mag of magazines_json_1.default) {
            mag._id = new mongodb_1.ObjectId(mag._id);
            const revs = Array();
            for (let revId of mag.reviews) {
                const index = revIndexOff(reviews_json_1.default, revId);
                console.log(`index = ${index}`);
                revs.push(revis[index]);
            }
            mag.reviews = revs;
            const tas = Array();
            for (let tId of mag.tags) {
                const index = revIndexOff(tags_json_1.default, tId);
                console.log(`index = ${index}`);
                tas.push(tagis[index]);
            }
            mag.tags = tas;
        }
        for (let i = 0; i < tags_json_1.default.length; i++)
            tags_json_1.default[i]._id = tagis[i];
        for (let i = 0; i < reviews_json_1.default.length; i++)
            reviews_json_1.default[i]._id = revis[i];
        console.log(magazines_json_1.default);
        console.log(reviews_json_1.default);
        console.log(tags_json_1.default);
        await (connection.collection(process.env.DB_TAGS_COLLECTION).insertMany(tags_json_1.default));
        await (connection.collection(process.env.DB_REVIEWS_COLLECTION).insertMany(reviews_json_1.default));
        await (connection.collection(process.env.DB_MAGAZINE_COLLECTION).insertMany(magazines_json_1.default));
    }
}
exports.checkDataPersistence = checkDataPersistence;
function revIndexOff(reviews, revId) {
    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i]._id === revId)
            return i;
    }
    return -1;
}
checkDataPersistence().then(() => {
    process.exit();
});
//# sourceMappingURL=migrate.js.map