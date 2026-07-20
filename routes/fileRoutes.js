const controller = require("../Controllers/fileController");

async function routes(fastify) {

    fastify.post("/upload", controller.uploadFile);

}

module.exports = routes;