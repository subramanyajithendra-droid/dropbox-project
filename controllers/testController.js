const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const s3Client = require("../config/s3");

exports.testS3 = async (req, reply) => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME
        });

        const result = await s3Client.send(command);

        reply.send({
            success: true,
            message: "AWS Connection Successful",
            bucket: process.env.AWS_BUCKET_NAME,
            totalFiles: result.KeyCount || 0,
            files: result.Contents || []
        });

    } catch (err) {

        console.error(err);

        reply.code(500).send({
            success: false,
            message: err.message
        });

    }
};