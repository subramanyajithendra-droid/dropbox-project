const Folder=require("../models/folder");

exports.createFolder=async(req,res)=>{

    try{

        const {name}=req.body;

        if(!name){

            return res.send({

                success:false,
                message:"Folder name required"

            });

        }

        const exists=await Folder.findOne({

            name:name.trim(),
            parentFolder:null

        });

        if(exists){

            return res.send({

                success:false,
                message:"Folder already exists"

            });

        }

        const folder=await Folder.create({name:name.trim()});

        res.send({

            success:true,
            message:"Folder created",
            folder

        });
    }

    catch(err){

        res.send({

            success:false,
            message:err.message

        });
    }
};

exports.getFolders=async(req,res)=>{

    try{

        const folders=await Folder.find().sort({createdAt:-1});

        res.send({

            success:true,
            folders

        });

    } catch(err){

        res.send({

            success:false,
            message:err.message

        });
    }
};

