const fs = require('node:fs');
const path = require('node:path');
const Datastore = require('nedb-promises');

const dataDirectory = path.join(__dirname, 'data');
const databasePath = path.join(dataDirectory, 'users.nedb');

fs.mkdirSync(dataDirectory, { recursive: true });

const db = Datastore.create({
  filename: databasePath,
  autoload: true
});

const seedUsers = [
  { id: 1, name: 'Ivan Ivanov', email: 'ivan@example.com' },
  { id: 2, name: 'Anna Petrova', email: 'anna@example.com' },
  { id: 3, name: 'Petr Sidorov', email: 'petr@example.com' }
];

const ready = (async () => {
  const usersCount = await db.count({});

  if (usersCount === 0) {
    await db.insert(seedUsers);
  }
})();

async function ensureReady() {
  await ready;
}

async function getNextId() {
  const users = await db.find({}).sort({ id: -1 }).limit(1).exec();
  return users.length ? users[0].id + 1 : 1;
}

async function getUsers() {
  await ensureReady();
  return db.find({}).sort({ id: 1 }).exec();
}

async function getUserById(id) {
  await ensureReady();
  return db.findOne({ id });
}

async function createUser(name, email) {
  await ensureReady();

  const id = await getNextId();

  return db.insert({
    id,
    name,
    email
  });
}

async function updateUser(id, name, email) {
  await ensureReady();
  return db.update({ id }, { $set: { name, email } });
}

async function deleteUser(id) {
  await ensureReady();
  return db.remove({ id }, {});
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
