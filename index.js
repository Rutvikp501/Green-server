const express = require('express');
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const port= 8081

app.get('/',(req,res)=>{
    res.status(200).send('Welcome homepage')
})

app.listen(port,()=>{
    try {
        console.log(`app runing on port ${port}`);
    } catch (error) {
        console.log(error)
    }
})