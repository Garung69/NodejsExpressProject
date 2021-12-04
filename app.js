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

/*APP.get('/',async (req,res)=>{
    const notify1 = "Wellcome to ATN shop";
    const notify2 = "Just Login or Create your free account"
    const icon = "https://gifimage.net/wp-content/uploads/2017/08/smiley-gif-2.gif";
    res.render('fun',{notify1: notify1, notify2: notify2, icon: icon});
})
*/
 //render home file when open default localhost
 APP.get('/',async (req,res)=>{
     const notify1 = "Wellcome to ATN shop";
     const notify2 = "Just Login or Create your free account"
     const icon = "https://gifimage.net/wp-content/uploads/2017/08/smiley-gif-2.gif";
    res.render('home',{notify1: notify1, notify2: notify2, icon: icon});
})
//Executed when receiving registration request
APP.post('/register',async (req,res)=>{
    //Receive input data
    const username = req.body.username;
    const password = req.body.password;
    const newAccount = {Username:username,Password: password};
    //Execute add new data  
    const result  = await registerAcc(newAccount, username);
    if(result==true){
        //Create log for admin manage
        createLog(username, "register");
        const notify1 = "Create Account successful!";
        const notify2 = "Now login to shop and enjoy"
        const icon = "https://cdn.dribbble.com/users/147386/screenshots/5315437/success-tick-dribbble.gif";
        res.render('home',{notify1: notify1, notify2: notify2, icon: icon});
    }else{
        const notify1 = "Create Account failure, Account already exist!";
        const notify2 = "Try againt!"
        const icon = "https://cdn.dribbble.com/users/251873/screenshots/9288094/13539-sign-for-error-or-explanation-alert.gif";
        res.render('home',{notify1: notify1, notify2: notify2, icon: icon});
    }
    
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
    //if not found user => render home file againt
    else{
        const notify1 = "Password or Username is not correct";
        const notify2 = "Please try to login againt or create a new account"
        const icon = "https://cdn.dribbble.com/users/251873/screenshots/9288094/13539-sign-for-error-or-explanation-alert.gif";
        res.render('home',{notify1: notify1, notify2: notify2, icon: icon});
    } 
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
    await addNewToy(toyName, toyImg, toyPrice, toyInfo, username);
    
    //add new product
    
    //create log

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