const File = require("../Models/File");

const s3Service = require("../utils/s3Service");

exports.uploadFile = async (req, reply) => {

    try {
        const data = await req.file();

        const buffer = await data.toBuffer();

        if (!data) {
            return reply.code(400).send({
                success: false,
                message: "No file uploaded"
            });
        }
        const upload = await s3Service.uploadToS3({...data, buffer});

        const savedFile = await File.create({
            originalName: data.filename,
            fileName: upload.key,
            s3Key: upload.key,
            fileUrl: upload.url,
            mimeType: data.mimetype,
            size: buffer.length
        });

        reply.send({
            success: true,
            message: "File Uploaded Successfully",
            file: savedFile
        });

    } catch (err) {
        console.log(err);
        reply.code(500).send({
            success: false,
            message: err.message
        });
    }

};