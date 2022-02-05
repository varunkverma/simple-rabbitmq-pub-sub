const amqp = require("amqplib/callback_api");

// making a connection
amqp.connect("amqp://localhost", (err0, connection) => {
  if (err0) {
    throw err0;
  }

  // creating a channel
  connection.createChannel((err1, channel) => {
    if (err1) {
      throw err1;
    }

    // declaring an exchange
    const exchange = "logs";

    channel.assertExchange(exchange, "fanout", {
      durable: false,
    });

    // registering to the default queue
    channel.assertQueue(
      "",
      {
        exclusive: true, // when the connection closes, the queue will be deleted since its declared as exclusive
      },
      (err2, q) => {
        if (err2) {
          throw err2;
        }
        console.log(
          `[*] Waiting for a message in ${q.queue}. To exit press CTRL+C`
        );

        // binding the queue to the exchange
        channel.bindQueue(q.queue, exchange, "");

        // start consuming msgs

        channel.consume(
          q.queue,
          (msg) => {
            if (msg.content) {
              console.log(`[x] ${msg.content.toString()}`);
            }
          },
          {
            noAck: true,
          }
        );
      }
    );
  });
});
