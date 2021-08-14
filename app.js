const EXPRESS = require('express')
const { Int32, Double} = require('mongodb');

const { registerAcc,login,getAllProduct,getOwnProduct,getUser, addNewToy,deleteProduct} = require('./script');

const APP = EXPRESS()

APP.use(EXPRESS.urlencoded({extended:true}))
APP.set('view engine','hbs')


APP.get('/',async (req,res)=>{
    res.render('home');

})
APP.post('/register',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const newAccount = {Username:username,Password: password};
    await registerAcc(newAccount, username);
    res.redirect('/');
})
APP.post('/login',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const allProduct = await getAllProduct();
    const ownProduct = await getOwnProduct(username);
    const user = await getUser(username);
    if((await login(username, password))== 2){
        res.render('dashboard', {productData: allProduct, ownProductData: ownProduct, User: user});
    }
    else res.render('home');
})
APP.post('/addNewToy',async (req,res)=>{
    const toyName = req.body.newToyName;
    const toyImg = req.body.newToyImg;
    const toyPrice = req.body.newToyPrice;
    if(req.body.newToyInfo==""){
        var toyInfo = "None!";
    } else toyInfo = req.body.newToyInfo;
    const username = req.body.newToyOwner;
    const newProduct = {NameP:toyName,ImgP: toyImg,SellerP:username, PriceP: Double(toyPrice), InfoP: toyInfo};
    await addNewToy(newProduct);
    const user = await getUser(username);
    const allProduct = await getAllProduct();
    const ownProduct = await getOwnProduct(username);
    res.render('dashboard', {productData: allProduct, ownProductData: ownProduct, User: user});
})

APP.post('/delete',async (req,res)=>{
    const idInput = req.body.idP;
    console.log("chay den day")
    console.log(idInput)
    const username = req.body.ownP;
    await deleteProduct(idInput);
    const user = await getUser(username);
    const allProduct = await getAllProduct();
    const ownProduct = await getOwnProduct(username);
    res.render('dashboard', {productData: allProduct, ownProductData: ownProduct, User: user});
})

const PORT = process.env.PORT || 5000;
APP.listen(PORT);