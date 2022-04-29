"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewDAO = void 0;
const Connection_1 = require("./Connection");
const MainDAO_1 = require("./MainDAO");
const mongodb_1 = require("mongodb");
class ReviewDAO extends MainDAO_1.MainDAO {
    static it;
    COLLECTION = process.env.DB_REVIEWS_COLLECTION;
    async deleteOneById(id) {
        const res = await this.deleteOneHow({ _id: new mongodb_1.ObjectId(id) });
        return (typeof res !== "undefined") && res.deletedCount === 1;
    }
    static getInstance() {
        if (!this.it)
            this.it = new ReviewDAO(Connection_1.Connection.getInstance());
        return this.it;
    }
}
exports.ReviewDAO = ReviewDAO;
//# sourceMappingURL=ReviewDAO.js.map