import * as express from 'express';
import {Request, Response} from "express/ts4.0";
import {MagazineDAO} from "../db/MagazineDAO";

export const deleteRouter = express.Router();

deleteRouter.get('/byId', async (request: Request, response: Response) => {
    console.log('in delete');
    if (request.query.id) {
        const id: string = request.query.id as string;
        const res = await MagazineDAO.getInstance().deleteOneById(id);
        let message;
        if (res) {
            response.status(200);
            message = 'Ok';
        }
        else {
            message = 'Article not found';
            response.status(404);
        }

        response.send(message);
    }
});