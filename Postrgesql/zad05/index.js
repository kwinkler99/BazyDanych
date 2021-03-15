// Do zdefiniowania aplikacji użyjemy Express.js
const express = require('express');
const app = express();

// Nasza aplikacja będzie „konsumowała” dane w formacie JSON
app.use(express.json());

//==================================================================
// Definiujemy REST API – kod poniżej wymaga uzupełnienia
//==================================================================


//http GET http://localhost:5000/bands
// Pobieranie danych na temat wszystkich zespołów
app.get('/bands', async (req, res) => {
  try{
    const result = (await client.query("select * from Band"))
    
    return(res.send({
      allGroups: result.rows
    }))
  }catch{
    throw error;
  }
});


//http POST http://localhost:5000/bands/ name=wor12 date=01/02/25634
// Dodawanie rekordów do bazy
app.post('/bands', async (req, res) => {
  try{
    let name = req.body.name;
    let date = req.body.date;
    const result = (await client.query('INSERT INTO Band (name, creationdate) VALUES($1, $2) RETURNING *', [name, date]))
    
    return(res.send({
      toInsert: result.rows
    }))
  }catch(error){
    throw error;
  }
});


//http GET http://localhost:5000/bands/nazwa_zespolu
// Pobieranie danych na temat zespołu o danej nazwie
app.get('/bands/:bandName', async (req, res) => {
  try{
    let name = req.params.bandName;
    const result = (await client.query('select * from Band where name=$1', [name]))
    
    return res.send({
      band: result.rows
    })
  }catch(error){
    throw error;
  }
});


//http DELETE http://localhost:5000/bands/24
// Usuwanie rekordu związanego z zespołem
app.delete('/bands/:id', async (req, res) => {
  try{
    let id = req.params.id;
    const result = (await client.query('DELETE FROM Band WHERE id=$1 RETURNING *', [id]))  
    
    return(res.send({
      deleteBand: result.rows 
    }))
  }catch(error){
    throw error;
  }
});


//http PUT http://localhost:5000/bands/1 name=Genesis_new date=06/01/1967
// Aktualizacja rekordu związanego z zespołem
app.put('/bands/:id', async (req, res) => {
  try{
    let date = req.body.date;
    let name = req.body.name;
    let id = req.params.id;
    const result = (await client.query('UPDATE Band SET name=$2, creationdate=$1 WHERE id=$3 RETURNING *', [date, name, id]))
    
    return(res.send({
      updatedBandId: result.rows
    }))
  }catch(error){
    throw error;
  }
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



/*
ZADANIE 1----------------------------------

  const query = {
    text: "select * from Band"
  }
  client.query(query, (error, result) => {
    if(error) throw error;
    return res.send({
      allGroups: [result.rows]
    });
  })


ZADANIE 2 ----------------------------------
const query = {
  text: "INSERT INTO Band (name, creationdate) VALUES($1, $2)",
  values: [name, date]
};

client.query(query, (error, result) => {
  if (error) throw error;
  return res.send({
    toInsert: {'name': name,
                'date': date}
  });
});

LUB

app.post('/bands', (req, res) =>{
  const text = 'INSERT INTO Band (name, creationdate) VALUES($1, $2) RETURNING *'
  const values = [req.body.name, req.body.date]
  client.query(text, values, (err, result) => {
    if(err){
      console.log(err.stack)
    }
    else{
      console.og(result.row)
      return res.send({
        band:result.rows
      })
    }
  })
})


ZADANIE 3 ------------------------------------
app.get('/bands/:bandName', async (req, res) =>{
  let name = req.params.bandName;
  const query = {
    text: "select * from Band where name=$1",
    values: [name]
  }

  client.query(query, (err, result) => {
    if (err) throw err;
    return res.send({
      queryFor: [result.rows]
    });
  });

})


ZADANIE 4 -------------------------------------
const query = {
    text: "DELETE FROM Band WHERE id=$1",
    values: [id]
  }

  client.query(query, (err, result) => {
    if (err) throw err;
    return res.send({
      deletedBandId: id
    });
  });


ZADANIE 5 -------------------------------------
const query = {
  text: "UPDATE Band SET name=$2, creationdate=$1 WHERE id=$3",
  values: [date, name, id]
}
client.query(query, (err, result) => {
  if (err) throw err;
  return res.send({
    updatedBandId: id
  });
});
*/