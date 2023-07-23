require('dotenv').config();
const PORT = process.env.PORT||5006;

const app = require('./app');

app.listen(PORT, ()=>{
    console.log(`Server is running at http//localhost:${PORT}`);
})