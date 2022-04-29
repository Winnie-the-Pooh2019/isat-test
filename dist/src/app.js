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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
const search_1 = require("./controllers/search");
const main_1 = require("./controllers/main");
const delete_1 = require("./controllers/delete");
const Connection_1 = require("./db/Connection");
dotenv.config();
if (!process.env.APP_PORT)
    process.exit(1);
const app = (0, express_1.default)();
const PORT = parseInt(process.env.APP_PORT, 10);
console.log(`PORT = ${PORT}`);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname.replace('dist/src', ''), 'public')));
app.set('view engine', 'pug');
app.set('views', 'public');
app.use('/search', search_1.searchRouter);
app.use('/delete', delete_1.deleteRouter);
app.use('/', main_1.mainRouter);
app.listen(PORT).on("error", () => {
    console.log('error while trying listen the port' + PORT);
});
process.on("SIGINT", () => {
    Connection_1.Connection.getInstance().disconnect().then(r => {
        process.exit();
    });
});
//# sourceMappingURL=app.js.map