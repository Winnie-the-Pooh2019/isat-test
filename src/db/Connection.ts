import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import {Db, MongoClient} from "mongodb";

export class Connection {
    private static it: Connection;

    readonly client: MongoClient;

    private constructor() {
        dotenv.config();
        const url = process.env.DB_CONNECTION_STRING;
        if (url !== undefined) {
            this.client = new mongoDB.MongoClient(url);
        } else
            throw new URIError("couldn't find connection url");
    }

    async connect(dbName?: string): Promise<Db> {
        const res = await (this.client.connect());

        if (dbName)
            return res.db(dbName);
        else
            return res.db(process.env.DB_NAME);
    }

    async disconnect() {
        try {
            await this.client.close();
        } catch (e: any) {
            console.log(e);
        }
    }

    static getInstance() {
        if (!Connection.it) {
            Connection.it = new Connection();
        }

        return Connection.it;
    }
}