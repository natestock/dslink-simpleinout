const {DSLink, RootNode, BaseLocalNode, ValueNode, ActionNode} = require('dslink');
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
    this.createChild('Remove', Remove);
  }
}

class Remove extends ActionNode {
  onInvoke(params, parentNode) {
      parentNode.provider.removeNode(parentNode.path);
  }
}

let rootNode = new RootNode();
let board = rootNode.createChild('Board', Board);
let link = new DSLink('simpleinout', {rootNode, saveNodes: true});
link.connect();

const parseWebhook = (body) => {
  let username = body.username;
  let status = body.data.status;

  if (username && status) {
    if (this.children.has(username)) {

    } else {
      let person = board.createChild(username, Person);
      person.setValue(status);
    }
    return true;
  } else {
    return false;
  }
}

app.use(bodyParser.json());

app.use(morgan('tiny'));

app.post('/simpleinout', (req, res, next) => {
  const status = parseWebhook(req.body);
  if (status) {
    res.status(201).send(req.body);
  } else {
    res.status(400).send();
  }
});

app.use(errorhandler());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});