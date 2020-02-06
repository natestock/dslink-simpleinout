const {DSLink, RootNode, BaseLocalNode, ValueNode} = require("dslink");
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

function main() {
  let rootNode = new RootNode();
  rootNode.createChild('Board', Board);
  let link = new DSLink('simpleinout', {rootNode, saveNodes: true});
  link.connect();
}

app.use(express.static('public'));

app.use(bodyParser.json());

app.use(morgan('dev'));

app.post('/simpleinout', (req, res, next) => {
  console.log(req.body);
  res.status(201).send(req.body);
});

app.use(errorhandler());

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

main();