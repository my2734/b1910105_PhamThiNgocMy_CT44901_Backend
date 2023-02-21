const ApiError = require('../api-error')
const AuthService = require('../services/auth.service')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const MongoDB = require('../utils/mongodb.utils')
const TOKEN_SERECT = 'dfhshfd4785475&((*&*&*DFDFDHFJHF'
exports.register = async (req, res, next) => {
    // res.send(req.body)
    if (!req.body?.username) {
        return next(new ApiError(400, "Username can not be empty"))
    }
    if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"))
    }

    try {
        const authService = new AuthService(MongoDB.client);
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
        const document = await authService.create(req.body)
        return res.send(document)
    } catch (error) {
        console.log(error)
        new ApiError(500, "An error occurred white creating the contact")
    }
}


exports.login = async (req, res, next) => {
    // res.send(req.body)
    if (!req.body?.username) {
        return next(new ApiError(400, "Username can not be empty"))
    }
    if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"))
    }



    try {
        const authService = new AuthService(MongoDB.client);
        const auth_old = authService.find(req.body.username)
        const validated = await bcrypt.compare(req.body.password, auth_old.password)
        if (!validated) {
            res.status(400).json('Wrong credentials')
        }
        const { password, ...other } = user._doc
        const token = jwt.sign(other, TOKEN_SERECT)

        res.status(200).json(token)
    } catch (error) {
        console.log(error)
        new ApiError(500, "An error occurred white creating the contact")
    }
}
