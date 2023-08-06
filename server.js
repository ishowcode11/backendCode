const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`server started at port number ${PORT}`);
});
