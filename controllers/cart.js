const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Product = require('../models/product.js');


//Get user cart
router.get('/', async (req, res) => {
    try {
      // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Render index.ejs, passing items in users cart 
    res.render('cart/index.ejs', {
      cartItems: currentUser.cartItems,
      currentUser: currentUser
    });
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
  });

  //Post New Cart Item
  router.post('/', async (req,res)=> {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.cartItems.push(req.body);
    //save user
    await currentUser.save();
    // Don't Redirect
    res.redirect(req.get("Referrer") || "/");

  })

 //Update Cart Item 
router.put('/:cartObjectId', async (req,res) => {
  try {
    //get user
    const currentUser = await User.findById(req.session.user._id);
    //find current cartItem from the id supplied by req.params
    const cartItem = await currentUser.cartItems.id(req.params.cartObjectId);
    //set current cart item to new data in req body
    cartItem.set(req.body);
    // save user data
    await currentUser.save();
    // Don't Redirect
    res.redirect(req.get("Referrer") || "/");
  }
  catch (error) {
    console.log(error);
    res.redirect('/')
  }
})
  
//Delete Cart Item
router.delete('/:cartObjectId', async (req,res)=> {
  try{
    //get user
    const currentUser = await User.findById(req.session.user._id);
    // Use the Mongoose .deleteOne() method to delete 
    // an item using the id supplied from req.params
    currentUser.cartItems.id(req.params.cartObjectId).deleteOne();
    //Save User
    await currentUser.save();
    // Don't Redirect
    res.redirect(req.get("Referrer") || "/");
  }
  catch (error) {
    console.log(error);
    res.redirect('/')
  }
})

//FOR REFERENCE
//app.use('/users/:userId/cart', cartController); //handle cart routes
  module.exports = router;