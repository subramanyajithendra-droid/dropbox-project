const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({

    originalName: {
        type: String,
        required: true
    },

    fileName: {
        type: String,
        required: true
    },

    s3Key: {
        type: String,
        required: true
    },

    fileUrl: {
        type: String,
        required: true
    },

    mimeType: {
        type: String,
        required: true
    },

    size: {
        type: Number,
        required: true
    },

    folderId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Folder",

        default: null

    },
    
    isFavorite:{
        type:Boolean,
        default:false
    },

    isTrash:{
        type:Boolean,
        default:false
    },

}, {

    timestamps: true

});

module.exports = mongoose.model("File", fileSchema);