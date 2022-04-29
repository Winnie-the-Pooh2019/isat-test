import magazines from "./data/magazines.json";
import reviews from "./data/reviews.json";
import tags from "./data/tags.json";
import {Connection} from "../Connection";
import {ObjectId} from "mongodb";

export async function checkDataPersistence() {
    const connection = await (Connection.getInstance().connect());
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
        for (let tag of tags) {
            tagis.push(new ObjectId(tag._id));
        }
        const revis = Array();
        for (let review of reviews) {
            revis.push(new ObjectId(review._id));
        }

        for (let mag of magazines) {
            mag._id = new ObjectId(mag._id);

            const revs = Array();
            for (let revId of mag.reviews) {
                const index = revIndexOff(reviews, revId);
                console.log(`index = ${index}`);
                revs.push(revis[index]);
            }
            mag.reviews = revs;

            const tas = Array();
            for (let tId of mag.tags) {
                const index = revIndexOff(tags, tId);
                console.log(`index = ${index}`);
                tas.push(tagis[index]);
            }
            mag.tags = tas;
        }
        for (let i = 0; i < tags.length; i++)
            tags[i]._id = tagis[i];
        for (let i = 0; i < reviews.length; i++)
            reviews[i]._id = revis[i];

        console.log(magazines);
        console.log(reviews);
        console.log(tags);

        await (connection.collection(process.env.DB_TAGS_COLLECTION).insertMany(tags));
        await (connection.collection(process.env.DB_REVIEWS_COLLECTION).insertMany(reviews));
        await (connection.collection(process.env.DB_MAGAZINE_COLLECTION).insertMany(magazines));
    }
}

function revIndexOff(reviews, revId) {
    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i]._id === revId)
            return i;
    }

    return -1;
}

checkDataPersistence().then(() => {
    process.exit();
})