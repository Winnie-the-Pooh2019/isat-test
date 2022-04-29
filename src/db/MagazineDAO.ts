import {Connection} from "./Connection";
import {Document, DeleteResult, ObjectId} from "mongodb";
import {ReviewDAO} from "./ReviewDAO";
import {MainDAO} from "./MainDAO";

export class MagazineDAO extends MainDAO {
    private static it: MagazineDAO;
    COLLECTION = process.env.DB_MAGAZINE_COLLECTION as string;
    private readonly projection: { projection: { _id: number, name: number, authors: number, date: number } };

    private constructor(connection: Connection) {
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

    async findByName(queryName: string) {
        return this.findHow({name: new RegExp(queryName, 'i')}, this.projection);
    }

    async findByAuthor(queryAuthor: string) {
        console.log('IN FINDBYAUTHOR');
        return this.findHow({authors: new RegExp(queryAuthor, 'i')}, this.projection);
    }

    async fundBetweenDates(start: string, end: string) {
        const filter = {
            date: {
                $gte: start,
                $lte: end } }
        return this.findHow(filter, this.projection);
    }

    async findAuthors() {
        console.log('in find authors');

        const pipeline: Document[] = [
            {$unwind: {path: "$authors"}},
            {$group: {_id: "$authors"}},
            {$project: {_id: 1}}
        ];

        return this.aggregateHow(pipeline);
    }

    async findById(id: string) {
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

        const pipeline = [ { $match: { _id: { $eq: new ObjectId(id) } } },
            lookupReviews, lookupTags ];

        return this.aggregateHow(pipeline);
    }

    async deleteOneById(id: string): Promise<boolean> {
        try {
            const articleReviews = await this.findHow({_id: new ObjectId(id)}, {_id: 0, reviews: 1});
            if (!articleReviews)
                return false;

            console.log(`articlereviews = ${articleReviews[0].reviews}`);

            const reviewDao = ReviewDAO.getInstance();
            for (const review of articleReviews[0].reviews) {
                console.log(`reviewid = ${review}`);
                const res = await reviewDao.deleteOneById(review);
                console.log(`res = ${!res}`);
                if (!res)
                    return false;
            }

            const result = await this.deleteOneHow({_id: new ObjectId(id)}) as DeleteResult;
            console.log(`final remove res = ${!result}`);

            return (result.deletedCount === 1);
        } catch (e: any) {
            console.log(e);
            return false;
        } finally {
            await this.connection.disconnect();
        }
    }

    async insertOne<Type>(object: Type) {
        return this.insertHow(object);
    }

    static getInstance() {
        if (!this.it)
            this.it = new MagazineDAO(Connection.getInstance());

        return this.it;
    }
}