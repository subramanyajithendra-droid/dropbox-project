const File = require("../models/File");

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

exports.getFiles=async(req,reply)=>{

    try{

        const files = await File.find({
            $or: [
                { isTrash: false },
                { isTrash: { $exists: false } }
            ]
        }).sort({ createdAt: -1 });

        reply.send({

            success:true,

            files

        });

    }

    catch(err){

        reply.code(500).send({

            success:false,

            message:err.message

        });

    }

}

exports.permanentDelete = async(req,reply)=>{

    try{

        const file = await File.findById(req.params.id);

        if(!file){

            return reply.code(404).send({

                success:false,
                message:"File not found"

            });
        }

        await s3Service.deleteFromS3(file.s3Key);

        await File.findByIdAndDelete(req.params.id);

        reply.send({

            success:true,
            message:"File permanently deleted"

        });

    } catch(err){

        reply.code(500).send({

            success:false,
            message:err.message

        });

    }
}


exports.renameFile=async(req,reply)=>{      

    try{
        const file=await File.findById(req.params.id);

        if(!file){          
            return reply.code(404).send({
                success:false,  
                message:"File not found"
            });

        }

        file.originalName=req.body.fileName;

        await file.save();
        
        reply.send({
            success:true,
            message:"File renamed successfully",
            file
        });

    }
    catch(err){

        reply.code(500).send({  

            success:false,
            message:err.message 
        });
    }
}

exports.previewFile = async (req, reply) => {

    try {

        const file = await File.findById(req.params.id);

        if (!file) {
            return reply.code(404).send({
                success: false,
                message: "File not found"
            });
        }

        const signedUrl = await s3Service.getSignedUrl(file.s3Key);

        reply.send({
            success: true,
            url: signedUrl,
            mimeType: file.mimeType,
            fileName: file.originalName
        });

    } catch (err) {

        reply.code(500).send({
            success: false,
            message: err.message
        });

    }

};


exports.downloadFile = async (req, reply) => {

    try {

        const file = await File.findById(req.params.id);

        if (!file) {
            return reply.code(404).send({
                success: false,
                message: "File not found"
            });
        }

        const signedUrl = await s3Service.getSignedUrl(file.s3Key);

        reply.send({
            success: true,
            url: signedUrl
        });

    } catch (err) {

        reply.code(500).send({
            success: false,
            message: err.message
        });

    }

};

exports.toggleFavorite = async(req,reply)=>{

    try{

        const file = await File.findById(req.params.id);

        if(!file){

            return reply.code(404).send({

                success:false,
                message:"File not found"

            });

        }

        if(file.isTrash){

            return reply.send({

                success:false,
                message:"Cannot favorite trashed file"

            });

        }

        file.isFavorite =!file.isFavorite;

        await file.save();

        reply.send({

            success:true,

            favorite:file.isFavorite

        });

    } catch(err){

        reply.code(500).send({

            success:false,
            message:err.message

        });
    }
}

exports.moveToTrash = async(req,reply)=>{

    try{

        const file = await File.findById(req.params.id);

        if(!file){

            return reply.code(404).send({

                success:false,
                message:"File not found"

            });
        }

        file.isTrash=true;

        await file.save();

        reply.send({

            success:true,
            message:"Moved to trash"

        });

    } catch(err){

        reply.code(500).send({

            success:false,
            message:err.message

        });
    }
}

exports.getFavorites=async(req,reply)=>{

    try{

        const files = await File.find({

            isFavorite:true,
            isTrash:{
                $ne:true
            }
        }).sort({
            createdAt:-1
        });

        reply.send({

            success:true,
            files

        });
    } catch(err){

        reply.code(500).send({

            success:false,
            message:err.message

        });
    }
}


exports.getTrash=async(req,reply)=>{

    try{
        const files= await File.find({isTrash:true}).sort({createdAt:-1});

        reply.send({
            
            success:true,
            files

        });
    }
    catch(err){

        reply.code(500).send({

            success:false,
            message:err.message

        });
    }
}

exports.restoreFile = async (req, reply) => {

    try {

        const file = await File.findById(req.params.id);

        if (!file) {

            return reply.code(404).send({
                success:false,
                message:"File not found"
            });

        }

        file.isTrash = false;

        await file.save();

        reply.send({

            success:true,
            message:"File Restored"

        });

    } catch(err){

        reply.code(500).send({

            success:false,
            message:err.message

        });

    }

};


// GET /api/files

// POST /api/files/upload

// DELETE /api/files/:id

// PUT /api/files/:id

// GET /api/files/download/:id

// GET /api/files/search