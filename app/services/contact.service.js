const { ObjectId } = require('mongodb')

class ContactService {
    constructor(Client){
        this.Contact =  Client.db().collection('Contacts')
    }
    //Dinh nghia cac phuong htuc truy xuat CSDL, du dung mongodb API
    extractContactData(payload){
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite
        }

        //remove undefined fields
        Object.keys(contact).forEach(
            (key)=> contact[key] === undefined && delete contact[key]
        )
        return contact;
    }


    async create(payload){
        // console.log(payload)
        const contact = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            {$set: {favorite: contact.favorite === true}},
            { returnDocument: "after", upsert: true }
        )
        return result.value
    }

    async find(filter){
        const cursor = await this.Contact.find(filter)
        return await cursor.toArray()
    }

    async findByName(name){
        return await this.Contact.find({
            name: {$regex: new RegExp(name), $options: "i"}
        })
    }

    async findById(id){
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async update(id, paypload){
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        }
        const update = this.extractContactData(paypload)
        const result = await this.Contact.findOneAndUpdate(
            filter, 
            {$set: update},
            {returnDocument: "after"}
        )
        return result.value    
    }

    async delete(id){
        return await this.Contact.findOneAndDelete({
         _id : ObjectId.isValid(id) ? new ObjectId(id)  : null
        })
    }

    async deleteAll(){
        const result = await this.Contact.deleteMany();
        return result.deletedCount;
    }

    async findFavorite(){
        return await this.find({favorite: true})
    }
}

module.exports = ContactService