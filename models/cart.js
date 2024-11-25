const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    name: String,
    productID: String,
  category: String,
  price: Number,
  image: String,
  amount: Number  
  });

  const cartItem = mongoose.model("cartItem", cartSchema)    //the creates the collection but we call it model?  
                                                        //I don't know why we have to type Fruit for it to be transitioned to fruits?
 module.exports= cartItem
 //had to match the in quotes name above, even though Mongo will change it which feels insane

//come back to this