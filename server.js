const fastify = require('fastify')({ logger: true });

fastify.get('/', async (request, reply) => {
  return reply.type('text/html').send(`<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fastify API Demo</title>
</head>
<body>
  <h1>Демо Fastify</h1>
  <button id="apiButton">сделать запрос на АПИ</button>

  <script>
    const button = document.getElementById('apiButton');

    button.addEventListener('click', async () => {
      try {
        const response = await fetch('/api');
        const data = await response.json();

        if (data.message === 'Запрос прошел успешно') {
          console.log(data.message);
        } else {
          console.error('Неожиданный ответ от сервера:', data);
        }
      } catch (error) {
        console.error('Ошибка запроса:', error);
      }
    });
  </script>
</body>
</html>`);
});

fastify.get('/api', async (request, reply) => {
  return { message: 'Запрос прошел успешно' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
