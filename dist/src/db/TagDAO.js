"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagDAO = void 0;
const Connection_1 = require("./Connection");
const MainDAO_1 = require("./MainDAO");
class TagDAO extends MainDAO_1.MainDAO {
    static it;
    COLLECTION = process.env.DB_TAGS_COLLECTION;
    static getInstance() {
        if (!this.it)
            this.it = new TagDAO(Connection_1.Connection.getInstance());
        return this.it;
    }
    async insertMany(names) {
        const ids = Array();
        for (const n of names) {
            const res = await this.insertHow({ name: n });
            if (res)
                ids.push(res.insertedId);
        }
        return ids;
    }
}
exports.TagDAO = TagDAO;
//# sourceMappingURL=TagDAO.js.map