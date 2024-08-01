const mongoose = require('mongoose');
require("dotenv").config();
//const mongoURI = process.env.mongoURI;

// mongodb://localhost:27017/notebook
//mongodb://localhost:27017

exports.connect = () => {
    mongoose.connect(process.env.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch( (error) => {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    } )
};

//mongodb+srv://soumenmandal0008:root@cluster0.wx9xp.mongodb.net/

