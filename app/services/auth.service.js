const { ObjectId } = require('mongodb')

class AuthService {
    constructor(Client){
        this.Auth =  Client.db().collection('Auth')    }
    //Dinh nghia cac phuong htuc truy xuat CSDL, du dung mongodb API
    extractAuthData(payload){        
        const auth = {
            username: payload.username,
            password: payload.password
        }
        //remove undefined fields
        Object.keys(auth).forEach(
            (key)=> auth[key] === undefined && delete auth[key]
        )
        return auth;
    }
    async create(payload){
        // console.log(payload)
        const user = this.extractAuthData(payload);
        const result = await this.Auth.findOneAndUpdate(
            user,
            {$set: {favorite: user.favorite === true}},
            { returnDocument: "after", upsert: true }
        )
        return result.value
    }
    async find(username){
        return await this.User.findOne({
            username  : username
        })
    }    
}

module.exports = AuthService