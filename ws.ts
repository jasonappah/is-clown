import Fastify from "fastify";
import "./cron.ts";

const fastify = Fastify({
	logger: true,
});

fastify.get("/", (_, reply) => {
	reply.send({ hello: "hi. i have a web server cause fly wants me to have one. this is literally all it does", src: "https://jasonaa.me/g/is-clown" });
});

// Run the server!
fastify.listen(process.env.PORT || 8080, function (err, address) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});
