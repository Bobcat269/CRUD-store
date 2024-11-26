const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const User = require('./models/user.js');
const Product = require('./models/product.js');

//middleware
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const cartController = require('./controllers/cart.js');
const authController = require('./controllers/auth.js');

const PORT = process.env.PORT ? process.env.PORT : '3002';

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', ()=> {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

//In order for ejs to use external css we have to call middleware every time we
//req/res.  Therefore we place our assets in the public folder, and let the app 
//know we use /public
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use(methodOverride("_method"));

//Explain what this does.
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  
  app.use(passUserToView);

// app.get('/', (req,res)=> {
//     res.render('index.ejs', {
//         // user: req.session.user,
//     })
// })

app.get('/', (req, res) => {
    // Check if the user is signed in
    if (req.session.user) {
      // Redirect signed-in users to their cart
      res.redirect(`/users/${req.session.user._id}/cart`);
    } else {
      // Show the homepage for users who are not signed in
      res.render('index.ejs');
    }
  });

//ALL PRODUCTS
app.get("/products", async (req,res) =>{
    const allProducts = await Product.find();
    const currentUser = await User.findById(req.session.user._id);
    res.render('products/index.ejs', {
        products: allProducts,
        currentUser: currentUser
    })
  }) 

//SHOW ROUTE
app.get("/products/:productID", async (req,res) =>{
    //Get item data from products model
    const clickedProduct = await Product.findById(req.params.productID)
    //Get user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // need to match req.params.productID to currentUser.cartItems to find what
    // index if any match the product
    const index = currentUser.cartItems.findIndex(obj => obj.productID === req.params.productID)
    // THIS IS AN ARRAY
    // const cartObject = await cartItem.find({productID:req.params.productID})
    
res.render("products/show.ejs", {item: clickedProduct, cartObject: currentUser.cartItems[index], currentUser: currentUser})

    
})

// //GET products POST page
// app.get("/products/new", (req,res)=>{
//     res.render('products/new.ejs')
// })

// //POST products
// app.post("/products", async (req, res) => {
//     await Product.create(req.body);
//     res.redirect(req.get("Referrer") || "/");
//   });


app.use(morgan('tiny'));
app.use('/auth', authController); //handle auth routes
app.use(isSignedIn);
app.use('/users/:userId/cart', cartController); //handle cart routes

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
    
})

module.exports = router;