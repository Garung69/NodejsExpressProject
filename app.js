//express library declaration
const EXPRESS = require('express')
//Declare the input data type
const {Double} = require('mongodb');
//declare functions from javascript files
const { registerAcc,login,getAllProduct,getOwnProduct,getUser, addNewToy,deleteProduct, getLogServer,createLog,createLogAdmin, getLogAdminServer} = require('./script');

const APP = EXPRESS()

APP.use(EXPRESS.static('resource'))
APP.use(EXPRESS.urlencoded({extended:true}))
APP.set('view engine','hbs')

//render home file when open default localhost
APP.get('/',async (req,res)=>{
    res.render('home');
})
//Executed when receiving registration request
APP.post('/register',async (req,res)=>{
    //Receive input data
    const username = req.body.username;
    const password = req.body.password;
    const newAccount = {Username:username,Password: password};
    //Execute add new data  
    await registerAcc(newAccount, username);
    //Create log for admin manage
    createLog(username, "register");
    //render home file again
    res.redirect('/');
})

//Executed when receiving login request
APP.post('/login',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    //Get data form database
    const allProduct = await getAllProduct();
    const ownProduct = await getOwnProduct(username);
    const user = await getUser(username);
    //if user login => render dashboard
    if((await login(username, password))== 2){
        createLog(username, "login");
        res.render('dashboard', {productData: allProduct, ownProductData: ownProduct, User: user});
    }
    //if admin login => render dashboard
    if((await login(username, password))== 1){
        const server = await getLogServer();
        const adminServer = await getLogAdminServer();
        res.render('admin', {server: server,productData: allProduct,adminServer: adminServer});
    }
    //if not found user => render home file again
    else res.render('home');
})

//Executed when receiving add product request
APP.post('/addNewToy',async (req,res)=>{
    const toyName = req.body.newToyName;
    const toyImg = req.body.newToyImg;
    const toyPrice = req.body.newToyPrice;
    if(req.body.newToyInfo==""){
        var toyInfo = "None!";
    } else toyInfo = req.body.newToyInfo;
    const username = req.body.newToyOwner;
    const newProduct = {NameP:toyName,ImgP: toyImg,SellerP:username, PriceP: Double(toyPrice), InfoP: toyInfo};
    //add new product
    await addNewToy(newProduct);
    //create log
    createLog(username, "add a product to shop");
    //get data
    const user = await getUser(username);
    const allProduct = await getAllProduct();
    const ownProduct = await getOwnProduct(username);
    res.render('dashboard', {productData: allProduct, ownProductData: ownProduct, User: user});
})

//Executed when receiving delete product request
APP.post('/delete',async (req,res)=>{
    const idInput = req.body.idP;
    const username = req.body.ownP;
    const role = req.body.role;
    await deleteProduct(idInput);
    const user = await getUser(username);
    const allProduct = await getAllProduct();
    const ownProduct = await getOwnProduct(username);
    //if admin delete product create logAdmin and render admin file
    if(role == "admin"){
        const server = await getLogServer();
        const adminServer = await getLogAdminServer();
        createLogAdmin(role, "deleted a "+ username +"'s product in shop");
        res.render('admin', {server: server,productData: allProduct,adminServer: adminServer});
    }
    //if user unSell product create userLog and render dashboard file
    else{
        createLog(username, "deleted a product in shop");
        res.render('dashboard', {productData: allProduct, ownProductData: ownProduct, User: user});
    }
    
})

//port declaration
const PORT = process.env.PORT || 5000;
//Ask the server to point to the port
APP.listen(PORT);