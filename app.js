const express = require('express')
const app = express()

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/views/home.html')
})

app.get('/about', (req,res)=>{
    res.sendFile(__dirname + '/views/about.html')
})

const PORT = 5000;
app.listen(PORT);
console.log('Server is running on PORT ', PORT)
