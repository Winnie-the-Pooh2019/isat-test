import {Connection} from "./Connection";
import {MainDAO} from "./MainDAO";
import {ObjectId} from "mongodb";

export class TagDAO extends MainDAO{
    private static it: TagDAO;
    COLLECTION = process.env.DB_TAGS_COLLECTION as string;

    static getInstance() {
        if (!this.it)
            this.it = new TagDAO(Connection.getInstance());

        return this.it;
    }

    async insertMany(names: string[]): Promise<ObjectId[]> {
        const ids = Array<ObjectId>();

        for (const n of names) {
            const res = await this.insertHow({name: n});

            if (res)
                ids.push(res.insertedId);
        }

        return ids;
    }
}