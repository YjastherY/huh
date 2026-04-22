const path = require('node:path');
const Fastify = require('fastify');
const fastifyStatic = require('@fastify/static');
const fastifyView = require('@fastify/view');
const fastifyFormbody = require('@fastify/formbody');
const pug = require('pug');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('./database');

const fastify = Fastify({ logger: true });

fastify.register(fastifyFormbody);

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
});

fastify.register(fastifyView, {
  engine: { pug },
  root: path.join(__dirname, 'views')
});

function renderUserForm(reply, options) {
  return reply.view('create-user.pug', options);
}

function getValidatedUserId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function getTrimmedFormData(body) {
  return {
    name: body?.name?.trim() || '',
    email: body?.email?.trim() || ''
  };
}

fastify.get('/', async (request, reply) => {
  return reply.redirect('/users');
});

fastify.get('/users', async (request, reply) => {
  return reply.view('users.pug', {
    title: 'Список пользователей',
    users: await getUsers()
  });
});

fastify.get('/users/create', async (request, reply) => {
  return renderUserForm(reply, {
    title: 'Создание пользователя',
    heading: 'Создание пользователя',
    errorMessage: '',
    formAction: '/users',
    submitLabel: 'Создать пользователя',
    formData: {
      name: '',
      email: ''
    }
  });
});

fastify.post('/users', async (request, reply) => {
  const formData = getTrimmedFormData(request.body);

  if (!formData.name || !formData.email) {
    reply.code(400);

    return renderUserForm(reply, {
      title: 'Создание пользователя',
      heading: 'Создание пользователя',
      errorMessage: 'Заполните имя и email.',
      formAction: '/users',
      submitLabel: 'Создать пользователя',
      formData
    });
  }

  await createUser(formData.name, formData.email);

  return reply.redirect('/users');
});

fastify.get('/users/:id/edit', async (request, reply) => {
  const id = getValidatedUserId(request.params.id);

  if (!id) {
    return reply.redirect('/users');
  }

  const user = await getUserById(id);

  if (!user) {
    return reply.redirect('/users');
  }

  return renderUserForm(reply, {
    title: 'Редактирование пользователя',
    heading: 'Редактирование пользователя',
    errorMessage: '',
    formAction: `/users/${user.id}/edit`,
    submitLabel: 'Сохранить изменения',
    formData: user
  });
});

fastify.post('/users/:id/edit', async (request, reply) => {
  const id = getValidatedUserId(request.params.id);

  if (!id) {
    return reply.redirect('/users');
  }

  const user = await getUserById(id);

  if (!user) {
    return reply.redirect('/users');
  }

  const formData = getTrimmedFormData(request.body);

  if (!formData.name || !formData.email) {
    reply.code(400);

    return renderUserForm(reply, {
      title: 'Редактирование пользователя',
      heading: 'Редактирование пользователя',
      errorMessage: 'Заполните имя и email.',
      formAction: `/users/${id}/edit`,
      submitLabel: 'Сохранить изменения',
      formData: {
        id,
        ...formData
      }
    });
  }

  await updateUser(id, formData.name, formData.email);

  return reply.redirect('/users');
});

fastify.post('/users/:id/delete', async (request, reply) => {
  const id = getValidatedUserId(request.params.id);

  if (id) {
    await deleteUser(id);
  }

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
