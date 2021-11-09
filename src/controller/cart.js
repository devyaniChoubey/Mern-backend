const Cart = require('../models/cart');
var mongoose = require('mongoose');
exports.addItemToCart = (req, res) => {

    Cart.findOne({ user: req.user._id })
        .exec((error, cart) => {
            if (error) return res.status(400).json({ error });
            if (cart) {
                let product;
                product = req.body.cartItems.product
                const item = cart.cartItems.find(c => JSON.stringify(c.product) === JSON.stringify(product))
                let condition, action;
                if (item) {
                    condition = { "user": req.user._id, "cartItems.product":mongoose.Types.ObjectId(product) };
                    action = {
                        "$set": {
                            "cartItems.$": {
                                ...req.body.cartItems,
                                quantity: item.quantity + req.body.cartItems.quantity

                            }
                        }
                    }
                    //return res.status(201).json({ message:"DFGH" });
                } else {
                    condition = { user: req.user._id };
                    action = {
                        "$push": {
                            "cartItems": req.body.cartItems
                        }
                    }
                }
                Cart.findOneAndUpdate(condition, action)
                    .exec((error, _cart) => {
                        if (error) return res.status(400).json({ error });
                        if (_cart) {
                            return res.status(201).json({ cart: _cart });
                        }
                    })
            } else {
                const cart = new Cart({
                    user: req.user._id,
                    cartItems: [req.body.cartItems]
                })
                cart.save((error, cart) => {
                    if (error) return res.status(400).json({ error });
                    if (cart) {
                        return res.status(201).json({ cart })
                    }
                })
            }
        })




}