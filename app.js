const express = require('express')
const app = express()

app.use(express.urlencoded({extended:true}))
app.set('view engine', 'hbs')

app.post('/survey',(req,res)=>{
    var nameInput = req.body.txtName;
    var job = req.body.job;
    res.render('survey',{name: nameInput, job:job});
})

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/views/home.html')
})

app.get('/about', (req,res)=>{
    res.sendFile(__dirname + '/views/about.html')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('Server is running on PORT ', PORT)
