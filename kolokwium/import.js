const mongoose = require("mongoose");
const express = require('express');
const app = express();

const url = "mongodb://localhost/kolokwium";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (response) => {
    console.log("${response.connections[0].name}")
    const port = process.env.PORT || 5000
    let Person = mongoose.model(
        "Person", new mongoose.Schema(
          { name: String, surname: String, sex: String },
          { collection: "dokumenty" }
        )
      );
    app.listen(port, () => {
      console.log("API server listening at http://localhost:${port}");
    });
    console.log(await Person.find());
  })
  .catch(error => console.error('Error connecting to MongoDB', error));