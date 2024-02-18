//access key id : f694c40b9fd70ad53b6734b17af34c84
//secret access key : c6003326bc5faad7da3504b155858f226048952aa617383439df35a240a26ef0
//endpoint for S3: https://4cf4007788e49411ce404afbe2a0e268.r2.cloudflarestorage.com

import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import bodyParser from "body-parser";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();



const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();

    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    
    files.forEach(async file => {
      //C:\Users\aradhya\Desktop\Ethan Personal Projects\NexaDeploy\dist\output\zrc3e
      
      let normalizedFile = file.replace(/\\/g, "/");
      await uploadFile(normalizedFile.slice(__dirname.length + 1), file);
    })

    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");
    const value = await publisher.hGet("status", id); 
    res.json({
        id: id
    })
})

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response
  })
})
app.listen(3000); 