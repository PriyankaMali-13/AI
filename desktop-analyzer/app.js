require('dotenv').config();
const express = require('express');

const port = process.env.PORT || 3000 ;
const route = require('./src/routes/analyze');
const app = express();

app.use(express.json());
app.use('/', route );
app.use((err, req, res, next) => {
    return res.status(400).json({ message: err.message });
});

app.listen(port, ()=>{
    console.log(`Server running on ${port}`);
    
});
