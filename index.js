require("dotenv").config();

const Fastify = require("fastify");

const path = require("path");

const fs = require("fs");

const fastify = Fastify({
    logger: true
});

fastify.register(require("./config/db"));

fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
    prefix: "/"
});

fastify.get("/", async (req, reply) => {

    return reply.type("text/html").send(
        fs.readFileSync(path.join(__dirname, "views", "index.html"))
    );

});

fastify.register(require("@fastify/multipart"), {
    limits: {
        fileSize: 1024 * 1024 * 100
    }
});

fastify.register(require("./routes/fileRoutes"), {
    prefix: "/api/files"
});

fastify.register(require("./routes/testRoutes"), {
    prefix: "/api/test"
});

fastify.ready(err => {
    if (err) throw err;
    console.log(fastify.printRoutes());
});

fastify.listen({ port: process.env.PORT, host: "0.0.0.0"}, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);

    }
    console.log(`Server Running at ${address}`);

});