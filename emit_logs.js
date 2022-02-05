const amqp = require("amqplib/callback_api");

// create connection
amqp.connect("amqp://localhost", (err0, connection) => {
  if (err0) {
    throw err0;
  }

  // create channel
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }

    // declaring an exchange
    const exchange = "logs";

    // getting msg from console or using the default msg
    const msg = process.argv.slice(2).join(" ") || "Hello World!";

    // creating an exhange
    channel.assertExchange(exchange, "fanout", {
      durable: false,
    });

    // sending msg to a default queue via exchange.
    channel.publish(exchange, "", Buffer.from(msg));

    console.log(`[x] Sent: ${msg}`);
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
