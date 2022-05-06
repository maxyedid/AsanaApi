const express = require('express')

const app = express();
const port = 5000;

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use('/', (req, res) => {
    res.send("hello world");
});


app.listen(process.env.port || port, () => {
    console.log("connection terminated");
});
