"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRouter = void 0;
const express = __importStar(require("express"));
const MagazineDAO_1 = require("../db/MagazineDAO");
const TagDAO_1 = require("../db/TagDAO");
exports.searchRouter = express.Router();
const dao = MagazineDAO_1.MagazineDAO.getInstance();
exports.searchRouter.get('/all', async (request, response) => {
    const data = (await dao.findAll());
    response.json(data);
});
exports.searchRouter.get('/byName', async (request, response) => {
    if (!request.query.name) {
        response.redirect('/search/all');
        return;
    }
    const data = (await dao.findByName(request.query.name));
    response.setHeader('Content-Type', 'application/json');
    response.json(data);
});
exports.searchRouter.get('/byAuthor', async (request, response) => {
    if (!request.query.author) {
        response.redirect('/search/all');
        return;
    }
    const data = (await dao.findByAuthor(request.query.author));
    response.setHeader('Content-Type', 'application/json');
    response.json(data);
});
exports.searchRouter.get('/betweenDates', async (request, response) => {
    if (!request.query.start || !request.query.end) {
        response.redirect('/search/all');
        return;
    }
    const data = (await dao.fundBetweenDates(request.query.start, request.query.end));
    console.log(data);
    response.setHeader('Content-Type', 'application/json');
    response.json(data);
});
exports.searchRouter.get('/authors', async (request, response) => {
    const data = await dao.findAuthors();
    response.json(data);
});
exports.searchRouter.post('/add', async (request, response) => {
    if (!request.body) {
        response.redirect('/create');
        return;
    }
    console.log(request.body);
    const authors = request.body.authors.split(/,\s*/);
    const array = request.body.tags.split(/,\s*/);
    console.log(`tags = ${array}`);
    const tagDao = TagDAO_1.TagDAO.getInstance();
    const tags = await tagDao.findHow({}, {});
    const ids = await insertOrGetTag(array, typeof tags === "undefined" ? undefined : tags);
    const object = request.body;
    object.authors = authors;
    object.tags = ids;
    console.log(object);
    const insertRes = (await MagazineDAO_1.MagazineDAO.getInstance().insertOne(object));
    console.log(`final insert res = ${typeof insertRes !== "undefined" ? insertRes.insertedId : 'unknown'}`);
    response.redirect('/');
});
async function insertOrGetTag(tagNames, actualTags) {
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
        const tagDao = TagDAO_1.TagDAO.getInstance();
        ids.push(await tagDao.insertMany(tagNames));
    }
    console.log(`identified ids = ${ids}`);
    return ids;
}
function contains(tag, actualTags) {
    for (const actual of actualTags) {
        if (tag.toLowerCase().replace(/\s/g, '')
            === actual.name.toLowerCase()) {
            return actual._id;
        }
    }
    return -1;
}
//# sourceMappingURL=search.js.map