const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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

exports.getSignedUrl = async (key) => {

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    });

    return await getSignedUrl(s3Client, command, {
        expiresIn: 60 * 5 // 5 minutes
    });

};

exports.deleteFromS3 = async (key) => {

    const command = new DeleteObjectCommand({

        Bucket: process.env.AWS_BUCKET_NAME,

        Key: key

    });

    await s3Client.send(command);

    return {

        success: true

    };

};