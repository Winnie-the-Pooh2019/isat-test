"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainDAO = void 0;
class MainDAO {
    connection;
    DB_NAME = process.env.DB_NAME;
    COLLECTION;
    constructor(connection) {
        this.connection = connection;
    }
    async findHow(filter, projection) {
        console.log(`dbname = ${this.DB_NAME}`);
        const db = await this.connection.connect(this.DB_NAME);
        try {
            return (db.collection(this.COLLECTION)
                .find(filter, projection)).toArray().finally(() => {
                this.connection.disconnect();
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    async aggregateHow(pipeline) {
        const db = await this.connection.connect(this.DB_NAME);
        try {
            return (db.collection(this.COLLECTION)
                .aggregate(pipeline, {})).toArray().finally(() => {
                this.connection.disconnect();
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    async insertHow(object) {
        const db = await this.connection.connect(this.DB_NAME);
        try {
            return (db.collection(this.COLLECTION)
                .insertOne(object)).finally(() => {
                this.connection.disconnect();
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    async deleteOneHow(filter) {
        const db = await this.connection.connect(this.DB_NAME);
        try {
            return (await db.collection(this.COLLECTION)
                .deleteOne(filter));
        }
        catch (e) {
            console.log(e);
        }
        finally {
            await this.connection.disconnect();
        }
    }
}
exports.MainDAO = MainDAO;
//# sourceMappingURL=MainDAO.js.map