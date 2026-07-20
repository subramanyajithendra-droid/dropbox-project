const {
    PutObjectCommand
} = require("@aws-sdk/client-s3");

// const { v4: uuid } = require("uuid");
const { randomUUID } = require("crypto");

const path = require("path");

const s3Client = require("../config/s3");

exports.uploadToS3 = async (file) => {

    const extension = path.extname(file.filename);

    const uniqueName = `${randomUUID()}${extension}`;

    const command = new PutObjectCommand({

        Bucket: process.env.AWS_BUCKET_NAME,

        Key: uniqueName,

        Body: file.buffer,

        ContentType: file.mimetype,

        ContentLength: file.buffer.length

    });

    await s3Client.send(command);

    return {

        key: uniqueName,

        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueName}`

    };

};