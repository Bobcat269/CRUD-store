const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({
  name: String,
  productID: String,
  category: {String, enum: ['produce', 'dairy', 'meats']},
  price: Number,
  image: String,
  amount: Number,  
  });

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      cartItems: [cartSchema], // embedding the cartItems Schema here
    });

    const User = mongoose.model('User', userSchema);  
                                                        
module.exports = User;
 //had to match the in quotes name above, even though Mongo will change it which feels insane

