const path = require('path');

exports.viewHome = (req,res) =>{
    res.sendFile(path.join(__dirname, '../..', 'views', 'home.html'));
}