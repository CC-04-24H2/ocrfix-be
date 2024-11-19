# ocrfix-be

Backend service for OCRFix

## Description

OCRfix is a simple backend hands-on project. The goals of OCRfix is give a fixing of a OCR prediction of machine learning. The fixing data will be new training data for machine learning model.

## Tech Stack

### Programming Language

| Name                                                                    | Scope                     | Description                                                          |
| ----------------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------- |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)   | programming language      | main programming language                                            |
| [Node.js](https://nodejs.org)                                           | runtime environment       | JavaScript environment                                               |
| [Express.js](https://expressjs.com/)                                    | backend framework         | backend framework for RESTful API                                    |
| [Sequelize](https://sequelize.org/)                                     | object relational mapping | ORM for accessing MySQL                                              |
| [Sequelize CLI](https://sequelize.org/docs/v6/other-topics/migrations/) | ORM migration             | make migration easier for Sequelize (like Laravel's Eloquent)        |
| [mysql2](https://www.npmjs.com/package/mysql2)                          | MySQL connector for JS    | needed by Sequelize as MySQL driver                                  |
| [Joi](https://joi.dev/)                                                 | request validator         | validator for request body                                           |
| [dotenv](https://www.npmjs.com/package/dotenv)                          | .env loader               | load the environment variable file                                   |
| [bcrypt](https://www.npmjs.com/package/bcrypt)                          | password hash             | hash user's password to bcrypt                                       |
| [uuid](https://www.npmjs.com/package/uuid)                              | UUID library              | provide UUIDv7 for this project                                      |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)              | JWT library               | generate and verivy JWT for authentication                           |
| [ESLint](https://eslint.org/)                                           | JS linter                 | make sure your JS code consistent (this project use Airbnb standard) |

## How to Run

Simple way:

```bash
git clone https://github.com/CC-04-24H2/ocrfix-be
cd ocrfix-be
# create .env file
npm install
npm run dev
```
