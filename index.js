const {DSLink, RootNode, BaseLocalNode, ValueNode, ActionNode} = require('dslink');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorhandler = require('errorhandler');

class Board extends BaseLocalNode {
  app = express();
  port = 8444;
  constructor(path, provider) {
    super(path, provider);
  }
  parseWebhook = (body) => {
    let username = body.username;
    let status = body.data.status;
  
    if (username && status) {
      if (this.children.has(username)) {
        let person = this.children.get(username);
        person.setValue(status);
      } else {
        let newPerson = this.createChild(username, Person);
        newPerson.setValue(status);
      }
      return true;
    } else {
      return false;
    }
  }
  catchWebhook() {
    this.app.use(bodyParser.json());
    this.app.use(morgan('tiny'));

    this.app.use(errorhandler());

    this.app.post('/simpleinout', (req, res, next) => {
      const status = this.parseWebhook(req.body);
      if (status) {
        res.status(201).send(req.body);
      } else {
        res.status(400).send();
      }
    });

    this.app.listen(this.port, () => {
      console.log(`Listening on port ${port}`);
    });
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
board.catchWebhook();