import * as express from 'express';
import {Request, Response} from "express/ts4.0";
import {MagazineDAO} from "../db/MagazineDAO";
import {TagDAO} from "../db/TagDAO";
import {Document, WithId} from "mongodb";

export const searchRouter = express.Router();
const dao = MagazineDAO.getInstance();

searchRouter.get('/all', async (request: Request, response: Response) => {
    const data = (await dao.findAll());
    response.json(data);
});

searchRouter.get('/byName', async (request: Request, response: Response) => {
    if (!request.query.name) {
        response.redirect('/search/all');
        return;
    }

    const data = (await dao.findByName(request.query.name as string));

    response.setHeader('Content-Type', 'application/json');
    response.json(data);
});

searchRouter.get('/byAuthor', async (request: Request, response: Response) => {
    if (!request.query.author) {
        response.redirect('/search/all');
        return;
    }

    const data = (await dao.findByAuthor(request.query.author as string));

    response.setHeader('Content-Type', 'application/json');
    response.json(data);
});

searchRouter.get('/betweenDates', async (request: Request, response: Response) => {
    if (!request.query.start || !request.query.end) {
        response.redirect('/search/all');
        return;
    }

    const data = (await dao.fundBetweenDates(
        request.query.start as string, request.query.end as string));
    console.log(data);

    response.setHeader('Content-Type', 'application/json');
    response.json(data);
});

searchRouter.get('/authors', async (request: Request, response: Response) => {
    const data = await dao.findAuthors();
    response.json(data);
});

searchRouter.post('/add', async (request: Request, response: Response) => {
    if (!request.body) {
        response.redirect('/create');
        return;
    }

    console.log(request.body);

    const authors = request.body.authors.split(/,\s*/);
    const array = request.body.tags.split(/,\s*/);
    console.log(`tags = ${array}`);
    const tagDao = TagDAO.getInstance();
    const tags = await tagDao.findHow({}, {});
    const ids = await insertOrGetTag(array, typeof tags === "undefined" ? undefined : tags);

    const object = request.body;
    object.authors = authors;
    object.tags = ids;
    console.log(object);
    const insertRes = (await MagazineDAO.getInstance().insertOne(object));
    console.log(`final insert res = ${typeof insertRes !== "undefined" ? insertRes.insertedId: 'unknown'}`);

    response.redirect('/');
});

async function insertOrGetTag<Tag extends WithId<Document>>(tagNames: string[], actualTags?: Tag[]) {
    console.log(actualTags);
    const ids = Array();

    if (actualTags) {
        for (let i = 0; i < tagNames.length; i++) {
            const id = contains(tagNames[i], actualTags);
            if (id !== -1) {
                i--;
                ids.push(id);
                tagNames.shift();
            }
        }
    }

    if (tagNames.length !== 0) {
        const tagDao = TagDAO.getInstance();
        ids.push(await tagDao.insertMany(tagNames));
    }

    console.log(`identified ids = ${ids}`);

    return ids;
}

function contains(tag: string, actualTags: any[]) {
    for (const actual of actualTags) {
        if (tag.toLowerCase().replace(/\s/g, '')
            === actual.name.toLowerCase()) {
            return actual._id;
        }
    }

    return -1;
}