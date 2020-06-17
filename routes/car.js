    const  {Router }  = require('express')
    const router = Router ()
    const redis = require ('redis')
    const redisClient = redis.createClient()


    const dados = require ('../car.json');
    console.log(dados);

    //cache
    const cache = {} 

    //Banco ficticio
    const dbFind = (dados) =>{
     const time = parseInt(Math.random()*2000)
     return new Promise((resolve,reject) =>{
        setTimeout(()=> resolve('Time :' + time),time)
    })
    
}
  //REDIS getCache and setCache
  const getCache = (key) =>{
    return new Promise((resolve,reject)=>{
        redisClient.get(key,(err,value)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(value)
            }
        })
    })

}
const setCache = (key,value) =>{
    return new Promise((resolve,reject)=>{
        redisClient.set(key,value,'EX',10,(err)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(true)
            }
        })
    })

}

    router.get('/', (req,res) =>{
        res.send('caching things ')
    })
    
    router.get('/api/car', async(req,res) =>{
        const car = req.params.body

        const value = await getCache('api'+ car)
        if(value){
            res.send('Dados retornados do cache: '+ JSON.stringify(dados) + JSON.stringify(value))
        }
        else{
               const carValue = await dbFind(req.params.body)
               await setCache('api'+ car,carValue)
               res.send('Dados retornados do banco de dados: '+ JSON.stringify(dados) + JSON.stringify(carValue))
        }

        
    })  

    router.post('/api/car/send', async(req,res) =>{
       const car = req.params.body
       dados.placa = req.body.placa
       dados.renevam = req.body.renevam
       dados.debitos = req.body.debitos
       dados.valor = req.body.valor
       dados.descricao = req.body.descricao

       if(cache[car]){
           res.send('Dados enviados da cache: '  + JSON.stringify(cache[car]))
           
       }
       else{
           const carVal = await dbFind(req.params.body)
           cache[car] = {
               time: new Date().getTime()
           }
           res.send('Dados enviados ao banco de dados: ' + JSON.stringify(carVal))
         
        

           }}
    )
    
    


    module.exports = router;
