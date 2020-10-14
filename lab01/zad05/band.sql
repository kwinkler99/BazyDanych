CREATE TABLE IF NOT EXISTS band (
   id serial PRIMARY KEY,
   name VARCHAR UNIQUE NOT NULL,
   creationDate DATE not NULL
);
