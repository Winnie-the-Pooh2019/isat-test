import * as express from 'express';
import {Request, Response} from "express/ts4.0";
import {MagazineDAO} from "../db/MagazineDAO";
import {TagDAO} from "../db/TagDAO";
import {ObjectId} from "mongodb";
import {sort} from "./comparator";

export const mainRouter = express.Router();

mainRouter.get('/create', async (request: Request, response: Response) => {
    const tagsDao = TagDAO.getInstance();
    const allTags = await tagsDao.findHow({}, {});
    response.render('create.pug', {
        tags: allTags
    });
});

mainRouter.get('/', async (request: Request, response: Response) => {
    response.render('index.pug', {
        title: "main window"
    });
});

mainRouter.get('/rating', async (request: Request, response: Response) => {
    const pipeline = [
        {
            $lookup: {
                from: "reviews",
                localField: "reviews",
                foreignField: "_id",
                as: "reviews"
            }
        },
        {
            $project: {
                _id: 0,
                name: 1,
                authors: 1,
                date: 1,
                averageMark: {$avg: "$reviews.mark"},
                comments: {$size: "$reviews"}
            }
        }
    ];

    let data = await (MagazineDAO.getInstance().aggregateHow(pipeline));
    data = sort(data);
    console.log(`data = ${data}`);

    response.render('rating.pug', {
        articles: data
    });
})

mainRouter.get('/info', async (request: Request, response: Response) => {
    if (!request.query.id) {
        response.redirect('/');
        return;
    }

    const id: string = request.query.id as string;
    console.log(`id = ${id} ${new ObjectId(id)}`);

    const magazineDao = MagazineDAO.getInstance();
    const data = (await magazineDao.findById(id));
    console.log(parseInt(id, 16))
    console.log(`findById = ${data}`);
    if (!data) {
        response.redirect('/');
        return;
    }
    console.log(data[0].name);

    response.render('info.pug', {
        article: data[0]
    });
});