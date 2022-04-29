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
exports.mainRouter = void 0;
const express = __importStar(require("express"));
const MagazineDAO_1 = require("../db/MagazineDAO");
const TagDAO_1 = require("../db/TagDAO");
const mongodb_1 = require("mongodb");
const comparator_1 = require("./comparator");
exports.mainRouter = express.Router();
exports.mainRouter.get('/create', async (request, response) => {
    const tagsDao = TagDAO_1.TagDAO.getInstance();
    const allTags = await tagsDao.findHow({}, {});
    response.render('create.pug', {
        tags: allTags
    });
});
exports.mainRouter.get('/', async (request, response) => {
    response.render('index.pug', {
        title: "main window"
    });
});
exports.mainRouter.get('/rating', async (request, response) => {
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
                averageMark: { $avg: "$reviews.mark" },
                comments: { $size: "$reviews" }
            }
        }
    ];
    let data = await (MagazineDAO_1.MagazineDAO.getInstance().aggregateHow(pipeline));
    data = (0, comparator_1.sort)(data);
    console.log(`data = ${data}`);
    response.render('rating.pug', {
        articles: data
    });
});
exports.mainRouter.get('/info', async (request, response) => {
    if (!request.query.id) {
        response.redirect('/');
        return;
    }
    const id = request.query.id;
    console.log(`id = ${id} ${new mongodb_1.ObjectId(id)}`);
    const magazineDao = MagazineDAO_1.MagazineDAO.getInstance();
    const data = (await magazineDao.findById(id));
    console.log(parseInt(id, 16));
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
//# sourceMappingURL=main.js.map