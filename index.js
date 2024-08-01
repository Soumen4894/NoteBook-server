const database = require("./db");
const express = require('express')
var cors = require('cors')
const app = express()
const dotenv = require("dotenv")

dotenv.config();
const port =process.env.port || 5000;
database.connect()

app.use(express.json());
app.use(cors(
  {
  origin:"https://note-book-client.vercel.app/",
  credentials:true,
}
))

//connectToMongo.connect()

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.use('/api/auth', require('./Routes/auth'))
app.use('/api/notes', require('./Routes/notes'))
app.listen(port, () => {
  console.log(`Notebook app listening on port ${port}`)
})

