
const db = require('mongoose');

const connectDB = async (url) => {
    try {
        db.connect(url)
          .then( () => console.log("Connected to Database"));
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB; 