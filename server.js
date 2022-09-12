require("dotenv").config();
const express = require("express");
const app = express();
const api = require("./src/api");

const { PORT, HOST } = process.env;

app.use(express.json());
app.use("/api", api);

app.use((req,res)=>{
  res.status(404).send({
    status:'error',
    message:'Not found'
  })
})

app.use((error,req,res,next)=>{
  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  })
})

app.listen(PORT, () => {
  console.log(`API funcionando en ${HOST}:${PORT}`);
});
