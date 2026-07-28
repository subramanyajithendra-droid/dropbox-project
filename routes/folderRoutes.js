const controller=require("../controllers/folderController");

async function routes(fastify){

    fastify.post("/",controller.createFolder);

    fastify.get("/",controller.getFolders);

}

module.exports=routes;