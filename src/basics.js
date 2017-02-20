//node+express tutorial

var express = require('express');
var path = require('path');
var app = express();


/* Fill the code in routes/users.js so that it can return list of users.
   Defining routes in a dedicated folder and maintaining various routes for various flows helps in designing and writing rich functional servers.
   Figure out the way how you can use the below users route for this app
 */
var users = require('../routes/users');


/* Use the contacts route in this app to expose the contacts functionality for base_url/contacts
 */

//To be removed - start

var contacts = require('../routes/contacts');

//To be removed - end

//To be removed - start

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// To be removed - end


// sample route which matches a get request for the base url(http://localhost:3000/)

app.get('/', function (req, res) {
    res.send('This is a message from the sample route');
})


/*
write up a simple post route for the base URl which just echoes the json body sent to it.
*/

//To be removed - start

app.post('/', function (req, res) {

   res.send(req.body);

})

//To be removed - end



//To be removed - start

app.use("/users",users);

// To be removed - end

//To be removed - start

app.use("/contacts",contacts);

// To be removed - end


/* write to route to serve the missionRnD.png in public/images folder for URL base_url/images/missionRnD.png
 */

//To be removed - start

app.use(express.static(path.join(__dirname, '../public')));

// To be removed - end


/* catch 404
   return a error message with json {"status":404,"message":"The requested URL was not found"}
  */

// To be removed - start
app.use(function(req, res) {
    res.status(404);
    res.send({"status":404,"message":"The requested URL was not found"});
});
// To be removed - end

var server = app.listen(3001, function () {
    var port = server.address().port

    console.log("Example app listening at port %s", port)
})