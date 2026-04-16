const path = require('node:path');
const Fastify = require('fastify');
const fastifyStatic = require('@fastify/static');
const fastifyView = require('@fastify/view');
const fastifyFormbody = require('@fastify/formbody');
const pug = require('pug');

const fastify = Fastify({ logger: true });

const users = [
  { id: 1, name: 'Ivan Ivanov', email: 'ivan@example.com' },
  { id: 2, name: 'Anna Petrova', email: 'anna@example.com' },
  { id: 3, name: 'Petr Sidorov', email: 'petr@example.com' }
];

fastify.register(fastifyFormbody);

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
});

fastify.register(fastifyView, {
  engine: { pug },
  root: path.join(__dirname, 'views')
});

fastify.get('/', async (request, reply) => {
  return reply.view('index.pug', {
    title: 'Fastify Demo'
  });
});

fastify.get('/api', async () => {
  return { message: 'Запрос прошел успешно' };
});

fastify.get('/users', async (request, reply) => {
  return reply.view('users.pug', {
    title: 'Список пользователей',
    users
  });
});

fastify.get('/users/create', async (request, reply) => {
  return reply.view('create-user.pug', {
    title: 'Создание пользователя',
    errorMessage: '',
    formData: {
      name: '',
      email: ''
    }
  });
});

fastify.post('/users', async (request, reply) => {
  const name = request.body?.name?.trim() || '';
  const email = request.body?.email?.trim() || '';

  if (!name || !email) {
    reply.code(400);

    return reply.view('create-user.pug', {
      title: 'Создание пользователя',
      errorMessage: 'Заполните имя и email.',
      formData: { name, email }
    });
  }

  const nextId = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  users.push({
    id: nextId,
    name,
    email
  });

  return reply.redirect('/users');
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
