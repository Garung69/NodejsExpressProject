const {MongoClient,ObjectId} = require('mongodb');

//const URL = 'mongodb://localhost:27017';
const URL = 'mongodb+srv://garung69:tavip123@cluster0.dvp5p.mongodb.net/test';
const DATABASE_NAME = "GCH0803DB"

async function getDB() {
    const client = await MongoClient.connect(URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}


async function registerAcc(newAccount, username) {
    const dbo = await getDB();
    const Account = await dbo.collection("account").findOne({Username: username});
    if(Account == undefined){
        const newS = await dbo.collection("account").insertOne(newAccount);
        console.log("New account created with id: ", newS.insertedId.toHexString());
    }
    else console.log("Account already exists");

}

async function login(username, password){
    const dbo = await getDB();
    const Account = await dbo.collection("account").findOne({Username: username, Password: password});
    if(Account == undefined) return 3;
    if(Account.Username == "onlyadmin123"){
        return 1;
    }
    else return 2;
}
async function getAllProduct(){
    const dbo = await getDB();
    const allProduct = await dbo.collection("product").find({}).toArray();
    return allProduct;
}
async function getOwnProduct(username){
    const dbo = await getDB();
    const allProduct = await dbo.collection("product").find({SellerP: username}).toArray();
    return allProduct;
}
async function getUser(username){
    const dbo = await getDB();
    const User = await dbo.collection("account").find({Username: username}).toArray();
    console.log(User);
    return User;
}
async function addNewToy(newProduct){
    const dbo = await getDB();
    const Added = await dbo.collection('product').insertOne(newProduct);
    console.log("New account created with id: ", Added.insertedId.toHexString());
}

async function deleteProduct(idInput) {
    console.log(idInput)
    const dbo = await getDB();
    await dbo.collection("product").deleteOne({ _id: ObjectId(idInput) });
}
module.exports = {getDB,registerAcc,login,getAllProduct, getOwnProduct,getUser, addNewToy, deleteProduct}
