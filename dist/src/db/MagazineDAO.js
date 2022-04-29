"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagazineDAO = void 0;
const Connection_1 = require("./Connection");
const mongodb_1 = require("mongodb");
const ReviewDAO_1 = require("./ReviewDAO");
const MainDAO_1 = require("./MainDAO");
class MagazineDAO extends MainDAO_1.MainDAO {
    static it;
    COLLECTION = process.env.DB_MAGAZINE_COLLECTION;
    projection;
    constructor(connection) {
        super(connection);
        this.projection = {
            projection: {
                _id: 1,
                name: 1,
                authors: 1,
                date: 1
            }
        };
    }
    async findAll() {
        console.log(`IN FINDaLL`);
        return this.findHow({}, this.projection);
    }
    async findByName(queryName) {
        return this.findHow({ name: new RegExp(queryName, 'i') }, this.projection);
    }
    async findByAuthor(queryAuthor) {
        console.log('IN FINDBYAUTHOR');
        return this.findHow({ authors: new RegExp(queryAuthor, 'i') }, this.projection);
    }
    async fundBetweenDates(start, end) {
        const filter = {
            date: {
                $gte: start,
                $lte: end
            }
        };
        return this.findHow(filter, this.projection);
    }
    async findAuthors() {
        console.log('in find authors');
        const pipeline = [
            { $unwind: { path: "$authors" } },
            { $group: { _id: "$authors" } },
            { $project: { _id: 1 } }
        ];
        return this.aggregateHow(pipeline);
    }
    async findById(id) {
        const lookupTags = {
            $lookup: {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "tags"
            }
        };
        const lookupReviews = {
            $lookup: {
                from: "reviews",
                localField: "reviews",
                foreignField: "_id",
                as: "reviews"
            }
        };
        const pipeline = [{ $match: { _id: { $eq: new mongodb_1.ObjectId(id) } } },
            lookupReviews, lookupTags];
        return this.aggregateHow(pipeline);
    }
    async deleteOneById(id) {
        try {
            const articleReviews = await this.findHow({ _id: new mongodb_1.ObjectId(id) }, { _id: 0, reviews: 1 });
            if (!articleReviews)
                return false;
            console.log(`articlereviews = ${articleReviews[0].reviews}`);
            const reviewDao = ReviewDAO_1.ReviewDAO.getInstance();
            for (const review of articleReviews[0].reviews) {
                console.log(`reviewid = ${review}`);
                const res = await reviewDao.deleteOneById(review);
                console.log(`res = ${!res}`);
                if (!res)
                    return false;
            }
            const result = await this.deleteOneHow({ _id: new mongodb_1.ObjectId(id) });
            console.log(`final remove res = ${!result}`);
            return (result.deletedCount === 1);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        finally {
            await this.connection.disconnect();
        }
    }
    async insertOne(object) {
        return this.insertHow(object);
    }
    static getInstance() {
        if (!this.it)
            this.it = new MagazineDAO(Connection_1.Connection.getInstance());
        return this.it;
    }
}
exports.MagazineDAO = MagazineDAO;
//# sourceMappingURL=MagazineDAO.js.map