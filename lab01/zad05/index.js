// Do zdefiniowania aplikacji użyjemy Express.js
const express = require('express');
const app = express();

// Nasza aplikacja będzie „konsumowała” dane w formacie JSON
app.use(express.json());

//==================================================================
// Definiujemy REST API – kod poniżej wymaga uzupełnienia
//==================================================================

// Pobieranie danych na temat wszystkich zespołów
app.get('/bands', async (req, res) => {
  const query = {
    text: "select * from Band"
  }

  client.query(query, (error, result) => {
    if(error) throw error;
    return res.send({
      allGroups: [result.rows]
    });
  })
  
});

// Dodawanie rekordów do bazy
app.post('/bands', async (req, res) => {
  const query = {
    text: "INSERT INTO Band (name, creationdate) VALUES($1, $2)",
    values: ['brainc', '01/02/2020']
  };

  client.query(query, (err, result) => {
    if (err) throw err;
    return res.send(message);
  });

  const message = {
    toInsert: req.body
  };
  return res.send(res.message);
});

// Pobieranie danych na temat zespołu o danej nazwie
app.get('/bands/:bandName', async (req, res) => {
  let name = req.params.bandName;

  const query = {
    text: "select $name from Band"
  }

  client.query(query, (err, result) => {
    if (err) throw err;
    return res.send(res.message);
  });

  return res.send({
    queryFor: name
  });
});

// Usuwanie rekordu związanego z zespołem
app.delete('/bands/:id', async (req, res) => {
  let id = req.params.id;

  const query = {
    text: "DELETE FROM Band WHERE id=$id"
  }

  client.query(query, (err, result) => {
    if (err) throw err;
    return res.send(res.message);
  });

  return res.send({
    deletedBandId: id
  });
});

// Aktualizacja rekordu związanego z zespołem
app.put('/bands/:id', async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  let date = req.body.date;
  let name = req.body.name;

  const query = {
    text: "UPDATE band SET date=$date, name=$name name WHERE id=$id"
  }

  client.query(query, (err, result) => {
    if (err) throw err;
    return res.send(message);
  });

  return res.send({
    updatedBandId: id,
    data
  });
});

//==================================================================
// Poniższy kod nie powinien już wymagać zmian
//==================================================================

// Przygotowujemy/wczytujemy konfigurację połączenia z PostgreSQL-em
require('dotenv').config();
const dbConnData = {
    host: process.env.PGHOST || '127.0.0.1',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'postgres',
    user: process.env.PGUSER || 'postgres',
    password: 265728
};
// Łączymy się z bazą i „stawiamy” serwer API
// Do kontaktu z serwerem PostgreSQL wykorzystamy bibliotekę pg

const { Client } = require('pg');
const client = new Client(dbConnData);
console.log('Connection parameters: ');
console.log(dbConnData);
client
  .connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    const port = process.env.PORT || 5000
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch(err => console.error('Connection error', err.stack));
