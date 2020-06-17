const express = require ('express');
const app = express();
const morgan = require ('morgan');



//cache
const cache = {} 
//settings
app.set('port', process.env.PORT || 3000)
app.set ('json spaces', 2)

//middlewares
// permite ver en consola las requi del servidor, super cool.
app.use(morgan('dev')); 
app.use(express.json())


//routes
app.use(require('./routes/routes'));
app.use(require ('./routes/car'));

//inicializando el servisor
app.listen(3000, () =>{
    console.log(`Escutando port ${3000}`)
});