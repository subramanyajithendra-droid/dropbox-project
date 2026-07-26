const controller = require("../Controllers/fileController");

async function routes(fastify){

    fastify.get("/getFiles",controller.getFiles);

    fastify.post("/upload",controller.uploadFile);

    fastify.delete("/:id",controller.deleteFile);

    fastify.put("/:id",controller.renameFile);

    fastify.get("/preview/:id",controller.previewFile);

    fastify.get("/download/:id",controller.downloadFile);

}

module.exports=routes;