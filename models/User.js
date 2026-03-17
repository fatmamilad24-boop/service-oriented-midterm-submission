const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    address: [{
        street: String,
        city: String,
        zipCode: String,
        isDefault: Boolean
    }],
    role: { 
        type: String, 
        enum: ['customer', 'admin', 'restaurant_owner'], 
        default: 'customer' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', userSchema);