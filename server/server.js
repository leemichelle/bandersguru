const express = require('express');
const app = express();
const fs = require('fs');
const port = 8080;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(express.static('view'));

app.get('/scenarios', (req, res) => {
  fs.readFile('scenarios.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const scenarios = []
      for (let key in JSON.parse(data)) {
        scenarios.push(key)
      }
      res.status(200).send({ scenarios });
    }
  })
});

app.listen(port, () => {
  console.log(`listening on port ${port}`)
});