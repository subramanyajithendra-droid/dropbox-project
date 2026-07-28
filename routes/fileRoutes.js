const controller = require("../Controllers/fileController");

async function routes(fastify){

    fastify.get("/getFiles",controller.getFiles);

    fastify.post("/upload",controller.uploadFile);

    // move file to trash
    fastify.put("/trash/:id",controller.moveToTrash);

    // permanently delete from trash
    fastify.delete("/delete/:id",controller.permanentDelete);

    fastify.put("/restore/:id", controller.restoreFile);

    fastify.put("/rename/:id",controller.renameFile);

    fastify.get("/preview/:id",controller.previewFile);

    fastify.get("/download/:id",controller.downloadFile);

    fastify.put("/favorite/:id",controller.toggleFavorite);

    fastify.get("/favoritefiles",controller.getFavorites);

    fastify.get("/trash",controller.getTrash);

}

module.exports=routes;