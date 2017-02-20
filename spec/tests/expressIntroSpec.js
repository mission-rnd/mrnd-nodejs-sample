var fs = require('fs');

function getFilePath() {

    var path = require('path');
    return path.join(__dirname, '../..', 'public/images');
}

describe("Express Intro test suite:", function(){

    var request = require('request');
    //var request = require('C:/Program Files/nodejs/node_modules/npm/node_modules/request')
    var base_url = "http://localhost:3001";
    var contacts_url = base_url + "/contacts";

    describe("test basic server", function() {

        it("should get 404",function(done){

            request.get({
                    url: base_url + "/badurl",
                    json: true
                },
                function(error, response, body){

                    expect(response.statusCode).toBe(404);
                    done();
                });
        });

        it("should return proper error body",function(done){

            request.get({
                    url: base_url + "/badurl",
                    json: true
                },
                function(error, response, body){
                    expect(response.statusCode).toBe(404);
                    expect(body.status).toBe(404);
                    expect(body.message).toBe("The requested URL was not found");
                    done();
                });
        });

        it("should give sample get string",function(done){

            request.get({
                    url: base_url + "/"
                },
                function(error, response, body){

                    expect(response.statusCode).toBe(200);
                    expect(body).toBe('This is a message from the sample route');
                    done();
                });
        });
        it("post base url:should echo the body sent",function(done){

            var testBody = new Object();
            testBody.country = "india";
            testBody.continent = "asia";

            request.post({url: base_url+'/',
                    body: testBody,
                    json: true
                },
                function(error, response, body){
                    expect(response.statusCode).toBe(200);
                    expect(body.country).toBe(testBody.country);
                    expect(body.continent).toBe(testBody.continent);
                    done();
                });
        });

        it("should give sample get string for users homepage",function(done){

            request.get({
                    url: base_url + "/users/"
                },
                function(error, response, body){
                    expect(response.statusCode).toBe(200);
                    expect(body).toBe("Index page of users");
                    done();
                });
        });

        it("should return expected list of all users",function(done){
            self = this;
            request.get({
                    url: base_url + "/users/all"
                },
                function(error, response, body){
                    expect(response.statusCode).toBe(200);

                    try{
                        var result = JSON.parse(body);
                        expect(result).toEqual(["sachin","sehwag","ganguly","dravid","laxman"]);
                    }
                    catch (err){
                        self.fail(Error("Test failed due to invalid json string"));
                    }
                    done();
                });
        });

        it("should statically server image",function(done){

            request.get({
                    url: base_url + "/images/missionRnD.png"
                },
                function(error, response, body){
                    expect(response.statusCode).toBe(200);
                    try {
                        var fileContents = fs.readFileSync(getFilePath() + "/missionRnD.png", 'utf8');
                    }
                    catch(err){
                        console.log(err);
                    }
                    expect(body).toEqual(fileContents);
                    done();
                });
        });
    });

    describe("create update contact", function(){
        var idCreated;

        it("should get 404",function(done){

            request.get({
                    url: base_url + "/badurl",
                    json: true
                },
                function(error, response, body){

                    expect(response.statusCode).toBe(404);
                    done();
                });
        });
        it("should get 404",function(done){

            request.get({
                    url: contacts_url + "?id=500",
                    json: true
                },
                function(error, response, body){

                    expect(response.statusCode).toBe(404);
                    done();
                });
        });
        it("should create contact",function(done){

            var contact = new Object();
            contact.firstName = "jagan";
            contact.lastName = "peri";
            contact.phone = "23002300";

            request.post({url: contacts_url,
                    body: contact,
                    json: true
                },
                function(error, response, body){
                    expect(response.statusCode).toBe(200);
                    idCreated = body.id;
                    done();
                });
        });

        it("should retrieve contact",function(done){

            request.get({
                    url: contacts_url + "/" + idCreated,
                    json: true
                },
                function(error, response, body){

                    expect(response.statusCode).toBe(200);
                    expect(body.firstName).toBe("jagan");
                    done();
                });
        });
        it("should update contact",function(done){

            var updatedContact = new Object();
            updatedContact.phone = "32003200";
            request.put({
                    url: contacts_url + "/" + idCreated,
                    body: updatedContact,
                    json: true
                },
                function(error, response, body){

                    expect(response.statusCode).toBe(200);
                    done();
                });
        });
        it("should retrieve updated contact",function(done){

            request.get({
                    url: contacts_url + "/" + idCreated,
                    json: true
                },
                function(error, response, body){

                    expect(response.statusCode).toBe(200);
                    expect(body.firstName).toBe("jagan");
                    expect(body.phone).toBe("32003200");
                    done();
                });
        });
    });

});
