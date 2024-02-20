const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0236f975e48cf54cdb67b0e6813eaf570bcc687b9d9e394c59e42962d0520ab118": 100,
  "0346618d8f368d78cac058a2d466a08370c8f54c49c7d2bd160dea629182b317a6": 50,
  "039258dce8456ab9bd90c13bd7fd9a8b94bd377670ec77d28dccd83e9cbf992e97": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount,signature } = req.body;


  setInitialBalance(sender);
  setInitialBalance(recipient);
  
   const publicKey = secp.recoverPublicKey(hash, signature[0], signature[1]);

   if(toHex(publicKey) !== sender){
    res.status(400).send({ message: "UnAuthorized Transaction!!!!" });
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
