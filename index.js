const {DSLink, RootNode, BaseLocalNode, ValueNode, ActionNode} = require("dslink");
const {express} = require("express");
const app = express();
const port = 8081;

app.post('/simpleinout', (req, res, next) => {
  console.log(req);
});

class Board extends BaseLocalNode {
  constructor(path, provider) {
    super(path, provider);
  }
}

function main() {
  let rootNode = new RootNode();
  rootNode.createChild('Board', Board);
  let link = new DSLink('mydslink', {rootNode, saveNodes = true});
  link.connect();
}

app.listen(port, () => console.log(`Listening on port ${port}`));

main();