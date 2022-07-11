import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'postgres',
    password: POSTGRES_PASSWORD || 'postgres',
    port: POSTGRES_PORT || 5556,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();
  await client.query(`
  CREATE TABLE users
  (
    id SERIAL PRIMARY KEY,
    name VARCHAR (30) NOT NULL,
    date TIMESTAMP DEFAULT now()
    );
    `);
    await client.query(
      `CREATE TABLE categories
      (
        id SERIAL PRIMARY KEY,
        name VARCHAR (30) NOT NULL
        );`
        );
      await client.query(
      `CREATE TABLE authors
      (
        id SERIAL PRIMARY KEY,
        name VARCHAR (30) NOT NULL
        );`
      );
      await client.query(
        `CREATE TABLE books
        (
          id SERIAL PRIMARY KEY,
          title VARCHAR(30) NOT NULL,
          userid INTEGER NOT NULL,
          authorid INTEGER NOT NULL,
          categoryid INTEGER NOT NULL,
          FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (authorid) REFERENCES authors(id) ON DELETE CASCADE,
          FOREIGN KEY (categoryid) REFERENCES categories(id) ON DELETE CASCADE
          );`
          ); 
      await client.query(
        `CREATE TABLE descriptions
        (
          id SERIAL PRIMARY KEY,
          description VARCHAR (10000) NOT NULL,
          bookid INTEGER UNIQUE NOT NULL, 
          FOREIGN KEY (bookid) REFERENCES books(id) ON DELETE CASCADE
          );`
          );
      await client.query(
        `CREATE TABLE reviews
        (
          id SERIAL PRIMARY KEY, 
          message VARCHAR (10000) NOT NULL, 
          userid INTEGER NOT NULL, 
          bookid INTEGER NOT NULL, 
          FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE, 
          FOREIGN KEY (bookid) REFERENCES books(id) ON DELETE CASCADE
          );`
          );
  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query('INSERT INTO users (name) VALUES(\'Denys\');');
  await client.query('INSERT INTO categories (name) VALUES(\'Literary Fiction\');');
  await client.query('INSERT INTO authors (name) VALUES(\'Thomas Pynchon\');');
  await client.query('INSERT INTO books (title, userid, authorid, categoryid) VALUES(\'Gravity\'s Rainbow\', 1, 1, 1);');
  await client.query('INSERT INTO descriptions (description, bookid) VALUES(\'Gravity\'s Rainbow is a 1973 novel by American writer Thomas Pynchon\', 1);');
  await client.query('INSERT INTO reviews (message, userid, bookid) VALUES(\'Gravity\'s Rainbow is a book you either love or hate, and if you hate it it\'s probably because you couldn\'t finish the damn thing. \', 1, 1);');

  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
