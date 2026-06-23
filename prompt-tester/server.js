require('dotenv').config();

const port = process.env.PORT || 3000 ;
const routeFile = require('./src/routes');
const express = require('express');

const app = express();

app.use(express.json());
app.use('/', routeFile);

app.listen(port, ()=>{
    console.log(`server listening on port ${port}`);
    
});
