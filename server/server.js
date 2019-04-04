const express = require('express');
const app = express();
const fs = require('fs');
const port = 8080;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(express.static('view'))

app.listen(port, () => {
  console.log(`listening on port ${port}`)
});