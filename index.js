const {DSLink, RootNode, BaseLocalNode, ValueNode} = require('dslink');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const app = express();
const port = 8444;

class Board extends BaseLocalNode {
  constructor(path, provider) {
    super(path, provider);
  }
}

class Person extends ValueNode {
  constructor(path, provider) {
    super(path, provider);
  }
}

let rootNode = new RootNode();
let board = rootNode.createChild('Board', Board);
let link = new DSLink('simpleinout', {rootNode, saveNodes: true});
link.connect();
app.use(bodyParser.json());

app.use(morgan('tiny'));

app.post('/simpleinout', (req, res, next) => {
  board.createChild('Test', Person);
  res.status(201).send(req.body);
});

app.use(errorhandler());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});