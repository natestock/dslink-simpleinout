const {DSLink, RootNode, BaseLocalNode} = require("dslink");
const express = require('express');
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
  let link = new DSLink('simpleinout', {rootNode});
  link.connect();
}

app.post('/simpleinout', (req, res, next) => {
  console.log(req);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

main();