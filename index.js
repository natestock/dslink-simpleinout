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

app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.status(200).send('Hello World');
});

app.use(errorhandler());

let rootNode = new RootNode();
rootNode.createChild('Board', Board);
let link = new DSLink('simpleinout', {rootNode, saveNodes: true});
link.connect();

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});