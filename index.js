const {DSLink, RootNode, BaseLocalNode, ValueNode} = require("dslink");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8444;

class Board extends BaseLocalNode {
  constructor(path, provider) {
    super(path, provider);
  }
  loadChild(name, data) {
    if (!this.children.has(name)) {
      if (data['$is'] === Person.profileName) {
        let node = this.createChild(name, Person);
        node.load(data);
        let value = data['?value'];
        node.setValue(value);
      }
    }
  }
}

Board.profileName = 'board';
Board.saveNodeOnChange = true;

class Person extends ValueNode {
  constructor(path, provider) {
    super(path, provider);
  }
}

Person.profileName = 'person';
Person.saveNodeOnChange = true;

async function main() {
  let rootNode = new RootNode();
  rootNode.createChild('Board', Board);
  let link = new DSLink('simpleinout', {rootNode, saveNodes: true});
  await link.connect();
}

//app.use(bodyParser.json());

app.post('/simpleinout', (req, res, next) => {
  console.log('Hello World');
  res.status(201).send();
});

app.listen(port, () => console.log(`Listening on port ${port}`));

main();