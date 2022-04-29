const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const PORT = 4000

app.use(cors())
const meli_endpoint = 'https://api.mercadolibre.com/sites/MLA'
const cache = {}

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('Home del servidor')
})

app.get('/api/search', (req, res) => {
    
    const query = req.query.query

    if(query){

        if(!cache[query]){

            console.log('Obteniendo datos de API Mercado Libre')

            axios
                .get(`${meli_endpoint}/search?q=${query}`)
                .then(response => {
                    cache[query] = response.data.results.map(e => {
                        return {
                            id: e.id,
                            title: e.title,
                            price: e.price,
                            currency_id: e.currency_id,
                            available_quantity: e.available_quantity,
                            thumbnail: e.thumbnail,
                            condition: e.condition
                        }
                    })
                })
                .then(() => res.send(cache[query]))
        }
        else{
            console.log('Obteniendo datos del cache del servidor')
            res.send(cache[query])
        }    
    }
    else {
        res.send('Envie un query')
    }
})