# Express RESTful API Server (MVC + Middleware)

Модульний RESTful вебсервер на базі **Node.js** та **Express.js** із підтримкою ES-модулів (`.mjs`), побудований за архітектурним патерном **MVC** (Models, Controllers, Routes, Middlewares). Проєкт демонструє інтеграцію проміжних обробників (middleware) для управління сесіями, логування запитів, аутентифікації, валідації вхідних даних, розмежування прав доступу та централізованої обробки помилок.

---

## Основні можливості

- **Архітектура MVC:** чітке розділення відповідальності між шарами даних, маршрутизації, бізнес-логіки та проміжних обробників.
- **Управління сесіями:** використання `express-session` із захищеними `httpOnly` cookie.
- **Багаторівневий захист маршрутів:**
    - логування запитів на кореневому маршруті `/`;
    - аутентифікація через заголовок `Authorization` для ресурсу `/users` та `/users/:userId`;
    - перевірка прав доступу для модифікації ресурсу `/articles` та `/articles/:articleId`;
    - валідація тіла запиту (`name` та `title`) перед виконанням операцій створення й оновлення.
- **Текстовий формат відповідей:** усі маршрути та обробники помилок повертають стандартизовані текстові відповіді з відповідними HTTP-статусами.
- **Глобальна обробка помилок:** перехоплення неіснуючих маршрутів (`404 Not Found`) та внутрішніх збоїв сервера (`500 Internal Server Error`).

---

## Технологічний стек

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js (`^4.21.2`)
- **Session Management:** `express-session` (`^1.18.1`)
- **Сховище даних:** In-memory `Map` (інкапсульовано у шарі моделей)

---

## Структура проєкту

```text
express-site/
├── src/
│   ├── models/                        # M — Шар даних (сховища Map)
│   │   ├── user.model.mjs             # Колекція користувачів
│   │   └── article.model.mjs          # Колекція статей
│   ├── controllers/                   # C — Бізнес-логіка обробки HTTP-запитів
│   │   ├── root.controller.mjs        # Обробник кореневого маршруту
│   │   ├── user.controller.mjs        # CRUD-логіка для /users
│   │   └── article.controller.mjs     # CRUD-логіка для /articles
│   ├── middlewares/                   # Проміжні обробники (Middleware)
│   │   ├── logger.middleware.mjs      # Логування вхідних запитів
│   │   ├── auth.middleware.mjs        # Аутентифікація користувачів
│   │   ├── validation.middleware.mjs  # Валідація тіла запиту (POST / PUT)
│   │   ├── permissions.middleware.mjs # Перевірка прав доступу до статей
│   │   └── error.middleware.mjs       # Глобальна обробка помилок (404, 500)
│   ├── routes/                        # Маршрути та підключення мідлварів
│   │   ├── index.mjs                  # Головний роутер додатку
│   │   ├── user.routes.mjs            # Маршрути /users та /users/:userId
│   │   └── article.routes.mjs         # Маршрути /articles та /articles/:articleId
│   └── server.mjs                     # Точка входу, ініціалізація Express та сесій
├── .gitignore
├── package.json
└── README.md
```

---

## Встановлення та запуск

### Передумови

- Встановлений **Node.js** версії 18.x або новішої.
- Менеджер пакетів **npm** або **Yarn**.

### Покрокова інструкція

1. Клонуйте репозиторій та перейдіть у директорію проєкту:

   ```bash
   git clone git@github.com:alina-koman/express-site.git
   cd express-site
   ```

2. Встановіть залежності:

   ```bash
   npm install
   ```

3. Запустіть сервер:

    - Стандартний запуск:

      ```bash
      npm start
      ```

    - Запуск у режимі розробки (з автоматичним перезапуском при зміні файлів):

      ```bash
      npm run dev
      ```

Після запуску сервер слухає порт `3000` за адресою: `http://localhost:3000`.

---

## Архітектура мідлварів

| Мідлвар | Файл | Область дії | Призначення |
|---|---|---|---|
| `session` | `src/server.mjs` | Глобально (`app.use`) | Ініціалізує сесію користувача та зберігає підписаний `sessionId` у `httpOnly` cookie на 1 годину. |
| `loggerMiddleware` | `src/middlewares/logger.middleware.mjs` | `GET /` | Виводить у консоль мітку часу (ISO), HTTP-метод та URL запиту. |
| `basicAuth` | `src/middlewares/auth.middleware.mjs` | `/users`, `/users/:userId` | Перевіряє наявність заголовка `Authorization`. За відсутності повертає `401 Unauthorized`. |
| `validationMiddleware` | `src/middlewares/validation.middleware.mjs` | `POST /users`, `PUT /users/:userId` | Перевіряє, що `req.body.name` є непорожнім рядком, та обрізає зайві пробіли. Інакше повертає `400 Bad Request`. |
| `checkArticlePermissions` | `src/middlewares/permissions.middleware.mjs` | `/articles`, `/articles/:articleId` | Дозволяє `GET`-запити всім, але для `POST`, `PUT`, `DELETE` вимагає роль `admin` або `editor` (у `req.session.role` або заголовку `x-user-role`). Інакше повертає `403 Forbidden`. |
| `validateArticleData` | `src/middlewares/validation.middleware.mjs` | `POST /articles`, `PUT /articles/:articleId` | Перевіряє, що `req.body.title` є непорожнім рядком. Інакше повертає `400 Bad Request`. |
| `notFoundHandler` | `src/middlewares/error.middleware.mjs` | Усі невідомі маршрути | Повертає `404 Not Found` для запитів на неіснуючі URL. |
| `errorHandler` | `src/middlewares/error.middleware.mjs` | Глобально (4 аргументи) | Логує стек викликів помилки та повертає `500 Internal Server Error`. |

---

## Довідник маршрутів API

Усі відповіді сервера повертаються у текстовому форматі.

### 1. Кореневий маршрут

| Метод | Маршрут | Мідлвари | Успішна відповідь | Опис |
|---|---|---|---|---|
| `GET` | `/` | `loggerMiddleware` | `200 OK` (`Get root route`) | Повертає привітання та логує вхідний запит. |

### 2. Користувачі (`/users`)

> **Вимога безпеки:** усі запити до `/users` та `/users/:userId` повинні містити заголовок `Authorization` (наприклад, `Authorization: Bearer token123`).

| Метод | Маршрут | Мідлвари | Тіло запиту (JSON) | Коди відповідей | Опис |
|---|---|---|---|---|---|
| `GET` | `/users` | `basicAuth` | — | `200 OK`, `401 Unauthorized` | Повертає список усіх користувачів. |
| `POST` | `/users` | `basicAuth`, `validationMiddleware` | `{"name": "Alice"}` | `201 Created`, `400 Bad Request`, `401 Unauthorized` | Створює нового користувача. |
| `GET` | `/users/:userId` | `basicAuth` | — | `200 OK`, `401 Unauthorized`, `404 Not Found` | Повертає дані користувача за його `userId`. |
| `PUT` | `/users/:userId` | `basicAuth`, `validationMiddleware` | `{"name": "Bob"}` | `200 OK`, `400`, `401`, `404` | Оновлює ім'я існуючого користувача. |
| `DELETE` | `/users/:userId` | `basicAuth` | — | `204 No Content`, `401`, `404` | Видаляє користувача за його `userId`. |

### 3. Статті (`/articles`)

> **Вимога прав доступу:** операції зміни даних (`POST`, `PUT`, `DELETE`) вимагають наявності заголовка `x-user-role: admin` або `x-user-role: editor` (або відповідної ролі в сесії).

| Метод | Маршрут | Мідлвари | Тіло запиту (JSON) | Коди відповідей | Опис |
|---|---|---|---|---|---|
| `GET` | `/articles` | `checkArticlePermissions` | — | `200 OK` | Повертає список усіх статей. |
| `POST` | `/articles` | `checkArticlePermissions`, `validateArticleData` | `{"title": "Node.js Guide"}` | `201 Created`, `400 Bad Request`, `403 Forbidden` | Створює нову статтю. |
| `GET` | `/articles/:articleId` | `checkArticlePermissions` | — | `200 OK`, `404 Not Found` | Повертає статтю за її `articleId`. |
| `PUT` | `/articles/:articleId` | `checkArticlePermissions`, `validateArticleData` | `{"title": "Updated Title"}` | `200 OK`, `400`, `403`, `404` | Оновлює заголовок існуючої статті. |
| `DELETE` | `/articles/:articleId` | `checkArticlePermissions` | — | `204 No Content`, `403`, `404` | Видаляє статтю за її `articleId`. |