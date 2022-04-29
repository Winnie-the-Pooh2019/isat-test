import { Schema, model, connect } from 'mongoose';
import {ReviewDTO} from "../../model/ReviewDTO";

export class Dao {
    private reviewSchema = new Schema<ReviewDTO>({
        _id: Number,
        name: String,
        mark: Number,
        message: String
    })

    private Review = model<ReviewDTO>('review', this.reviewSchema);

    async run() {
        await connect("mongodb+srv://ivan:ba1man_sucks@cluster0.91yu0.mongodb.net/FirstBase?retryWrites=true&w=majority");

        const review = await this.Review.find({});
        console.log(review);
    }
}

new Dao().run().then(r => process.exit());