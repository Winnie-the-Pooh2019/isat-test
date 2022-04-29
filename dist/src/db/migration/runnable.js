"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dao = void 0;
const mongoose_1 = require("mongoose");
class Dao {
    reviewSchema = new mongoose_1.Schema({
        _id: Number,
        name: String,
        mark: Number,
        message: String
    });
    Review = (0, mongoose_1.model)('review', this.reviewSchema);
    async run() {
        await (0, mongoose_1.connect)("mongodb+srv://ivan:ba1man_sucks@cluster0.91yu0.mongodb.net/FirstBase?retryWrites=true&w=majority");
        const review = await this.Review.find({});
        console.log(review);
    }
}
exports.Dao = Dao;
new Dao().run().then(r => process.exit());
//# sourceMappingURL=runnable.js.map