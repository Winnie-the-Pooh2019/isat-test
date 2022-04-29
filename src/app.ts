import express from 'express';
import * as dotenv from "dotenv"
import path from "path";
import { searchRouter } from "./controllers/search";
import {mainRouter} from "./controllers/main";
import {deleteRouter} from "./controllers/delete";
import {MagazineDAO} from "./db/MagazineDAO";
import {Connection} from "./db/Connection";

dotenv.config();
if (!process.env.APP_PORT)
    process.exit(1);
const app = express();
const PORT: number = parseInt(process.env.APP_PORT as string, 10);
console.log(`PORT = ${PORT}`);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname.replace('dist/src', ''), 'public')));
app.set('view engine', 'pug');
app.set('views', 'public');

app.use('/search', searchRouter);
app.use('/delete', deleteRouter);
app.use('/', mainRouter);

app.listen(PORT).on("error", () => {
    console.log('error while trying listen the port' + PORT);
});

process.on("SIGINT", () => {
    Connection.getInstance().disconnect().then(r => {
        process.exit();
    });
});