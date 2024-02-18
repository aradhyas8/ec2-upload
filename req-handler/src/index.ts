import express from 'express';
import { S3 } from 'aws-sdk';


const s3 = new S3({
  accessKeyId: "f694c40b9fd70ad53b6734b17af34c84",
  secretAccessKey:
    "c6003326bc5faad7da3504b155858f226048952aa617383439df35a240a26ef0",
  endpoint: "https://4cf4007788e49411ce404afbe2a0e268.r2.cloudflarestorage.com",
});


const app = express();

app.get('/*',async  (req, res) => {

    const host = req.hostname;
    console.log(host);
    const id = host.split('.')[0];
    const filePath = req.path;

    const contents = await s3
      .getObject({
        Bucket: "serverus",
        Key: `dist/${id}${filePath}`,
      })
      .promise();


    const type = filePath.endsWith("html") ? 'text/html' : filePath.endsWith("css") ? 'text/css' : 'application/javascript';
    res.setHeader("Content-Type", type);

    res.send(contents.Body);
})
app.listen(3001);
