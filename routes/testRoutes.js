const controller = require("../controllers/testController");

async function routes(fastify) {

    fastify.get("/s3", controller.testS3);

}

module.exports = routes;