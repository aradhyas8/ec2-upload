"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
const s3 = new aws_sdk_1.S3({
    accessKeyId: "f694c40b9fd70ad53b6734b17af34c84",
    secretAccessKey: "c6003326bc5faad7da3504b155858f226048952aa617383439df35a240a26ef0",
    endpoint: "https://4cf4007788e49411ce404afbe2a0e268.r2.cloudflarestorage.com",
});
const app = (0, express_1.default)();
app.get('/*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const host = req.hostname;
    console.log(host);
    const id = host.split('.')[0];
    const filePath = req.path;
    const contents = yield s3
        .getObject({
        Bucket: "serverus",
        Key: `dist/${id}${filePath}`,
    })
        .promise();
    const type = filePath.endsWith("html") ? 'text/html' : filePath.endsWith("css") ? 'text/css' : 'application/javascript';
    res.setHeader("Content-Type", type);
    res.send(contents.Body);
}));
app.listen(3001);
