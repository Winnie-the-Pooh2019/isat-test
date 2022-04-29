import {Document} from "mongodb";
import {Connection} from "./Connection";

export abstract class MainDAO {
    protected readonly DB_NAME = process.env.DB_NAME;
    protected readonly COLLECTION?: string;

    protected constructor(protected connection: Connection) {
    }

    public async findHow<Filter, Projection>(filter: Filter, projection: Projection) {
        console.log(`dbname = ${this.DB_NAME}`);
        const db = await this.connection.connect(this.DB_NAME);

        try {
            return (db.collection(this.COLLECTION as string)
                .find(filter, projection)).toArray().finally(() => {
                this.connection.disconnect();
            });
        } catch (e: any) {
            console.log(e);
        }
    }

    public async aggregateHow<Pipeline extends Document[]>(pipeline: Pipeline) {
        const db = await this.connection.connect(this.DB_NAME);

        try {
            return (db.collection(this.COLLECTION as string)
                .aggregate(pipeline, {})).toArray().finally(() => {
                this.connection.disconnect();
            });
        } catch (e: any) {
            console.log(e);
        }
    }

    public async insertHow<Type>(object: Type) {
        const db = await this.connection.connect(this.DB_NAME);

        try {
            return (db.collection(this.COLLECTION as string)
                .insertOne(object)).finally(() => {
                this.connection.disconnect();
            });
        } catch (e: any) {
            console.log(e);
        }
    }

    public async deleteOneHow<Filter>(filter: Filter) {
        const db = await this.connection.connect(this.DB_NAME);

        try {
            return (await db.collection(this.COLLECTION as string)
                .deleteOne(filter));
        } catch (e: any) {
            console.log(e);
        } finally {
            await this.connection.disconnect();
        }
    }
}