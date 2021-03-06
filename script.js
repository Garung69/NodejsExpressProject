//declare library mongodb
const {MongoClient,ObjectId, Double} = require('mongodb');

//declare database
const URL = 'mongodb+srv://garung69:tavip123@cluster0.dvp5p.mongodb.net/test';
const DATABASE_NAME = "GCH0803DB"

//get/set data form database
async function getDB() {
    const client = await MongoClient.connect(URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}

//function to register
async function registerAcc(newAccount, username) {
    const dbo = await getDB();
    const Account = await dbo.collection("account").findOne({Username: username});
    //Can only create a new account with a username that doesn't exist in the database.
    if(Account == undefined){
        const newS = await dbo.collection("account").insertOne(newAccount);
        return true;
    }
    else return false;
}

//function to login
async function login(username, password){
    const dbo = await getDB();
    const Account = await dbo.collection("account").findOne({Username: username, Password: password});
    if(Account == undefined) return 3;
    if(Account.Username == "onlyadmin123"){
        return 1;
    }
    else return 2;
}

//function to get all product data
async function getAllProduct(){
    const dbo = await getDB();
    const allProduct = await dbo.collection("product").find({}).toArray();
    return allProduct;
}

//function to get user product data
async function getOwnProduct(username){
    const dbo = await getDB();
    const allProduct = await dbo.collection("product").find({SellerP: username}).toArray();
    return allProduct;
}

//function to get user data
async function getUser(username){
    const dbo = await getDB();
    const User = await dbo.collection("account").find({Username: username}).toArray();
    return User;
}

//function to add new product
async function addNewToy(toyName, toyImg, toyPrice, toyInfo, username){
    dbo = await getDB();
    toyName = toyName;
    toyImg = toyImg;
    username = username;
    toyPrice = toyPrice;
    toyInfo = toyInfo;
    console.log(toyPrice);
    const nPrice = toyPrice.slice(0, toyPrice.lastIndexOf('$'));
    console.log(nPrice);
    console.log(toyPrice.indexOf('$'));
    console.log(isNaN(parseInt(nPrice)));
    if((toyPrice.indexOf('$') != -1) && (!isNaN(parseInt(nPrice)))){
        const newProduct = {NameP:toyName,ImgP: toyImg,SellerP:username, PriceP: toyPrice, InfoP: toyInfo};
        const Added = await dbo.collection('product').insertOne(newProduct);
        createLog(username, "add a product to shop");
    }
    else{
        console.log('Price Wrong!');
    }
}

//function to delete a product
async function deleteProduct(idInput) {
    const dbo = await getDB();
    await dbo.collection("product").deleteOne({ _id: ObjectId(idInput) });
}

//function to get UserLog
async function getLogServer(){
    const dbo = await getDB();
    const server = await dbo.collection("server").find({Id: undefined}).toArray();
    return server;
}

//function to get AdminLog
async function getLogAdminServer(){
    const dbo = await getDB();
    const server = await dbo.collection("server").find({Id: 1}).toArray();
    return server;
}

//function to get currentDate
function getCurrentDate(){
    return new Date().toLocaleString("vi-VN");
}

//function to create UserLog
async function createLog(username,action){
    const dbo = await getDB();
    var log = "User: " +username+ " had " + action + " at " + getCurrentDate();
    console.log(log);
    const newLog = {ServerLog: log}
    await dbo.collection("server").insertOne(newLog);
}

//function to create AdminLog
async function createLogAdmin(username, act){
    const dbo = await getDB();
    var log = username+ " had " + act + " at " + getCurrentDate();
    var id = 1;
    console.log(log);
    const newLog = {ServerLog: log,Id: id}
    await dbo.collection("server").insertOne(newLog);
}
//export functions
module.exports = {getDB,registerAcc,login,getAllProduct, getOwnProduct,getUser, addNewToy, deleteProduct, createLog, createLogAdmin, getLogServer, getLogAdminServer}
