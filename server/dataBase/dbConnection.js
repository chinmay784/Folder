const MonGoose = require("mongoose");

exports.DbConnect = async ()=>{
    MonGoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
}
