const mongoose = require('mongoose');

module.exports = async() => {
    const mongoUri = 'mongodb+srv://sai:2aMpoeFqP94XDVC3@cluster0.rtwv3kg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    try{
        const connect = await mongoose.connect(mongoUri, {
            useUnifiedTopology: true,
            useNewurlParser: true,
        });
        console.log(`Mongo DB Connected: ${connect.connection.host}`);
    } catch(error) {
        console.log("error:", error);
        process.exit(1);
    }
};