const mongoose = require("mongoose");

module.exports = async () => {
    const mongoDBURL=process.env.MONGODB_URL;
    await mongoose.connect(mongoDBURL).then(() => {
        console.log("Tushar SuperMart Database is Connected Successfully...");
    })
        .catch((err) => {
            console.log(`Error in connecting to Tushar SuperMart Database ... ${err}`);
            console.log("Please try after sometime...");
            process.exit(1);
        })
}

/*
 useNewUrlParser: true,
 useUnifiedTopology: true
*/