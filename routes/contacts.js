/* This exercise is basically similar in content as the one written with http module.
   But here you will implement the same using express and as a different route.
   Once done, Compare both the works and try to understand the importance of express when writing high functional servers.
 */

/*
* OVERVIEW: In this activity, you will implement a route to manage contacts. The rest service will store/retrieve contacts
* in memory. The rest service will implement the following operations:

    GET /contacts/id  This will read the specified contact from in memory data structure and return it in the response.
    Format for the Response body is:
    {"firstName":"Bill","lastName":"Gates","phone":"32003200"}

    POST /contacts  This will accept a JSON payload, create the contact in memory data structure and return id in the response.
    Format of JSON request body is: {"firstName":"Bill","lastName":"Gates","phone":"32003200"}
    Format of the JSON response is: {id:<id-of-new-contact}

    PUT /contacts/id  This will update the specified contacts details with the details in the JSON payload.
    Only fields that are specified in the request body need to be updated. Other fields of that contact should
    remain unchanged.
    Format of JSON request body is: {"firstName":"Bill","lastName":"Gates","phone":"32003200"}
    Format of the JSON response is: {id:<id-of-updated-contact>}

* ERROR CASES: Handle all error cases including:
    *		Any Url other than urls shown above should return 404
    *		Return bad request if any query string parameters are passed.
*		Return 404 if a non-existent contact id is passed.
*/

var express = require('express');
var router = express.Router();

var contacts = [];

var uniqueNumber = 0;

router.get('/:id', function(req, res, next) {
    if(isNaN(req.params.id)){
        res.status(400);
        res.end();
    }
    else{
        for(var contact in contacts){
            if(contacts[contact].id == parseInt(req.params.id)){
                res.status(200);
                res.contentType('application/json');
                res.end(JSON.stringify(contacts[contact]));
            }
        }
        res.status(404);
        res.end();
    }
});

router.post('/',function (req,res) {
    var newContact;
    if(req.body){

        newContact = req.body;
        newContact['id'] = uniqueNumber;
    }

    contacts.push(newContact);
    res.status(200);
    res.contentType('application/json');
    res.end(JSON.stringify({"id":uniqueNumber++}));
});

router.put('/:id',function (req,res) {
    var newContact;
    if(req.body){

        newContact = req.body;
    }

    if(isNaN(req.params.id)){
        res.status(400);
        res.end();
    }
    else{
        for(var contact in contacts){
            if(contacts[contact].id == parseInt(req.params.id)){
                for(var keyValue in newContact ){
                    contacts[contact][keyValue] = newContact[keyValue];
                }
                res.status(200);
                res.contentType('application/json');
                res.end(JSON.stringify({"id":contacts[contact].id}));
            }
        }
        res.status(404);
        res.end();
    }


});

module.exports = router;