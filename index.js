
const connectToMongo = require('./db');
const express = require('express')
connectToMongo();


const app = express()
const port = 3001
var cors = require('cors')
app.use(cors({
    origin: "*",
    credentials : false
}))
app.use(express.json())

app.use('/auth', require("./routes/auth.js"))
app.use('/notes', require("./routes/notes.js"))
app.get("/hari", (req,res) => {
    res.json(req.body)
})
app.listen(port, () => {
    console.log(`iNootebook backend listening at http://localhost:${port}`)
})
