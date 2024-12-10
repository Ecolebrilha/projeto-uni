const express = require('express')
const app = express()
const pagamentoRoutes = require("./routes/pagamentoRoutes")
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use('/api', pagamentoRoutes)

app.listen(3000,()=>{
console.log("Servidor rodando na porta 3000!")
})