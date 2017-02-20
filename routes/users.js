var express = require('express');
var router = express.Router();

//sample route

router.get('/', function(req, res, next) {
    res.send("Index page of users");
});
/* create a list of users ["sachin","sehwag","ganguly","dravid","laxman"] and return the JSON String for base_url/users/all
 */

//To be removed - start

router.get('/all', function(req, res, next) {
    res.contentType('application/json');
    var players = ["sachin","sehwag","ganguly","dravid","laxman"];
    res.send(JSON.stringify(players));
});

//To be removed - end

module.exports = router;
