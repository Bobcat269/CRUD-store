const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Item = require('./models/product')
const PORT = 3002

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', ()=> {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

//In order for ejs to use external css we have to call middleware every time we
//req/res.  Therefore we place our assets in the public folder, and let the app 
//know we use /public
app.use('/public', express.static('public'));

app.use(express.urlencoded({ extended: false}))
app.use(methodOverride("_method"))

const Product = require('./models/product.js')
const cartItem = require('./models/cart.js')

let cart = [];
// cart.push(
// {
//     itemID: '2q3409587234jas',
//     quantity: 2
// })

console.log(cart);

app.get('/', (req,res)=> {
    res.render('index.ejs', {
        // user: req.session.user,
    })
})

//DELETE Cart Item
app.delete('/products/cart/:productId', async (req,res)=>{
    await cartItem.findByIdAndDelete(req.params.productId)
    //need to refresh page?
    // res.status(204).send()
    res.redirect('back');
})



// app.use('/auth', authController);

//ALL PRODUCTS
app.get("/products", async (req,res) =>{
    const allProducts = await Product.find();
    res.render('products/index.ejs', {
        products: allProducts
    })
})

//ALL CART
app.get("/cart", async (req,res) =>{
    const cartItems = await cartItem.find();
    res.render('cart.ejs', {
        items: cartItems
    })
})
//CREATE PRODUCT PAGE
app.get("/products/new", (req,res)=>{
    res.render('products/new.ejs')
})

//POST TO PRODUCTS
app.post("/products", async (req,res)=>{
    await Product.create(req.body)
    res.render('products/new.ejs')
})

//POST TO CART
app.post("/products/cart", async (req,res)=>{
    await cartItem.create(req.body)
    //Not quite this, we need to post the item to the shopping cart.
    //for now lets just build it with a single DB for the shopping cart, 
    //we can correct later
    res.redirect('back');
})

//UPDATE CART ITEM
app.put('/products/cart/:productID', async (req,res)=>{
    await cartItem.findByIdAndUpdate(req.params.productID, req.body)
    res.redirect('back');
})

//RENDER PRODUCT PAGE
app.get("/products/:productID", async (req,res) =>{
    //Get item data from products model
    const clickedProduct = await Product.findById(req.params.productID)
    //If items are in cart we want the user to PUT instead or POST
    //to do this we look for items in the cart that match productID
    // THIS IS AN ARRAY
    const cartObject = await cartItem.find({productID:req.params.productID})

    res.render("products/show.ejs", {item: clickedProduct, cartObject: cartObject})

    
})
app.get("/cheeses/search", async (req,res) => {
    // const searchTag = req.query.search
    const searchResults = await Cheese.find({tags:{"$in" : [req.query.query]}})
    res.render("cheeses/search.ejs", {
        search: searchResults
    })
})

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
    
})
