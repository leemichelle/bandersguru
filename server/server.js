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

app.post('/game', (req, res) => {
  fs.readFile('scenarios.json', (err, data) => {
    if (err) {
      throw err;
    } else {
      let fileObj = JSON.parse(data);
      if (fileObj.playerSelections) {
        fileObj.playerSelections.push(req.body);
        jsonObj = JSON.stringify(fileObj);
      } else {
        fileObj.playerSelections = [];
        fileObj.playerSelections.push(req.body);
        jsonObj = JSON.stringify(fileObj);
      }
      fs.writeFile('scenarios.json', jsonObj, 'utf8', (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).send(req.body);
        }
      })
    }
  })
});

let progress;

app.get('/game/:id', (req, res) => {
  fs.readFile('scenarios.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const id = req.params.id
      const fileObj = JSON.parse(data);
      const gameFile = fileObj.playerSelections;
      let currentGame;
      for (let i = 0; i < gameFile.length; i++) {
        if (gameFile[i]['id'] === id) {
          const current = gameFile[i]['currentStep']
          gameFile[i]['choices'] = fileObj['BandersGuru']['nodes'][current]['choices'];
          currentGame = i;
        }
      }
      progress = gameFile[currentGame];
      res.status(200).send(gameFile[currentGame]);
    }
  })
});

app.post('/game/:id', (req, res) => {
  fs.readFile('scenarios.json', (err, data) => {
    if (err) {
      throw err;
    } else {
      const id = req.params.id
      const fileObj = JSON.parse(data);
      const gameFile = fileObj.playerSelections;
      let currentGame;
      for (let i = 0; i < gameFile.length; i++) {
        if (gameFile[i]['id'] === id) {
          const current = gameFile[i]['currentStep'];
          const currChoices = fileObj['BandersGuru']['nodes'][current]['choices'];
          gameFile[i]['choices'] = currChoices[req.body.choices];
          currentGame = i;
        }
      }
      progress = gameFile[currentGame];
      const jsonObj = JSON.stringify(fileObj);
      fs.writeFile('scenarios.json', jsonObj, 'utf8', (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).send(progress);
        }
      })
    }
  })
});

app.listen(port, () => {
  console.log(`listening on port ${port}`)
});