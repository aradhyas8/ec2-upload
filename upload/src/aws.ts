import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: "f694c40b9fd70ad53b6734b17af34c84",
  secretAccessKey: "c6003326bc5faad7da3504b155858f226048952aa617383439df35a240a26ef0",
  endpoint: "https://4cf4007788e49411ce404afbe2a0e268.r2.cloudflarestorage.com",
});

export const uploadFile = async( fileName: string, localFilePath: string) => {
    console.log("called");
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "serverus",
        Key: fileName,
    }).promise();
    console.log(response);
}