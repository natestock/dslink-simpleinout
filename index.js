const {DSLink, RootNode, BaseLocalNode, ValueNode} = require("dslink");
const {http} = require("http");

class Board extends BaseLocalNode {
  constructor(path, provider) {
    super(path, provider);
    const server = http.createServer(function (req, res) {   
      if (req.url == '/data') { //check the URL of the current request
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify({ message: "Hello World"}));  
              res.end();  
      }
    });
  }
}

class Person extends ValueNode {
  constructor(path, provider) {
    super(path, provider, 'bool[out,in]', undefined, true);
  }
}

async function main() {
  let rootNode = new RootNode();
  rootNode.createChild('Board', Board);
  let link = new DSLink('mydslink', {rootNode, saveNodes = true});
  await link.connect();
}

main();
