const express = require('express')
const cors = require('cors')
const contactsRouter = require('./app/routes/contact.route')
const authRouter =  require('./app/routes/auth.route')
const ApiError = require('./app/api-error')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/contacts',contactsRouter)
app.use('/api/auth', authRouter)



//handle 404 response
app.use((req,res,next)=>{
    //Code o day se chay khi khong co route duoc dinh nghia nao
    //Khop voi yeu cau. Goi next() de chuyen san middleware xu li loi
    return next(new ApiError(404, "Resource not found"))
})  
//define error-handling middleware last, affter other app.use and routers calls
app.use((err,req,res,next)=>{
    //Middleware xu li loi tap trung
    //se chuyen ve middleware xu li loi nay

    // res.status(err.statusCode || 500).json({message: err.message || "Internal Server Error"})


    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    })
})

module.exports = app