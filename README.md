# Fastify Users Demo

## Что делает проект
- `GET /` делает редирект на `/users`.
- `GET /users` выводит список пользователей из файловой базы данных.
- `GET /users/create` открывает форму создания пользователя.
- `POST /users` добавляет пользователя в базу.
- `GET /users/:id/edit` открывает форму редактирования пользователя.
- `POST /users/:id/edit` обновляет пользователя в базе.
- `POST /users/:id/delete` удаляет пользователя из базы.

## Запуск
   - `npm install`
   - `npm start`
   - `http://localhost:3000`
