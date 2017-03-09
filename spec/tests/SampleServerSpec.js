var dbHelper = require("./../../src/models/databaseHelper");

var request = require("request");

var tasks = require("./../../src/models/tasks");

function Task(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
}

describe("Sample test server test cases ", function() {

    var tasksUrl = "http://localhost:3001/tasks";

    var idCreated;

    it("should get dbConfig", function() {
        var dbConfig = dbHelper.getDBConfig();
        expect(dbConfig.hasOwnProperty("host")).toBeTruthy();
        expect(dbConfig.hasOwnProperty("port")).toBeTruthy();
        expect(dbConfig.hasOwnProperty("password")).toBeTruthy();
        expect(dbConfig.hasOwnProperty("user")).toBeTruthy();
        expect(dbConfig.hasOwnProperty("database")).toBeTruthy();
    });

    it("should return the connection with the given dbconfig ", function() {
        var dbConfig = dbHelper.getDBConfig();
        expect(dbConfig).not.toBe(null);
        var connection = dbHelper.getConnection(dbConfig);
        expect(connection).not.toBe(null);
        //end connection
        dbHelper.endConnection();
    });

    it("should not return connection for invalid config ", function() {
        var dbConfig = dbHelper.getDBConfig();
        delete dbConfig["host"];
        var connection = dbHelper.getConnection(dbConfig);
        expect(connection).toBe(null);
    });

    it("should setup the database table", function(done) {
        var dbConfig = dbHelper.getDBConfig();
        expect(dbConfig).not.toBe(null);
        var connection = dbHelper.getConnection(dbConfig);
        expect(connection).not.toBe(null);
        tasks.setupTasksTable(function(err, result) {
            expect(err).toBe(null);
            dbHelper.endConnection();
            done();
        });
    });

    it("should create task", function(done) {
        var self = this;
        var task = new Task(1, "TitleTest", "TitleDesc");
        request.post({
                url: tasksUrl,
                body: task,
                json: true
            },
            function(error, response, body) {
                try {
                    expect(response.statusCode).toBe(201);
                    idCreated = 1;
                    done();
                } catch (e) {
                    self.fail(Error(e));
                    done();
                }
            });
    });

    it("should get all the set of tasks ", function(done) {
        var self = this;
        request.get({
                url: tasksUrl,
                json: true
            },
            function(error, response, body) {
                try {
                    expect(response.statusCode).toBe(200);
                    expect(body.length).toBe(1);
                    done();
                } catch (e) {
                    self.fail(Error(e));
                    done();
                }
            });
    });

    it("should retrieve task 1", function(done) {
        var self = this;
        request.get({
                url: tasksUrl + "/" + idCreated,
                json: true
            },
            function(error, response, body) {
                try {
                    expect(response.statusCode).toBe(200);
                    expect(body.title).toBe("TitleTest");
                    done();
                } catch (e) {
                    self.fail(Error(e));
                    done();
                }
            });
    });

    it("should update task 1", function(done) {
        var self = this;
        var updatedTask = {};
        updatedTask.description = "This is my test description";

        request.put({
                url: tasksUrl + "/" + idCreated,
                body: updatedTask,
                json: true
            },
            function(error, response, body) {
                try {
                    expect(response.statusCode).toBe(204);
                    done();
                } catch (e) {
                    self.fail(Error(e));
                    done();
                }
            });
    });

    it("should retrieve updated task 1", function(done) {
        var self = this;
        request.get({
                url: tasksUrl + "/" + idCreated,
                json: true
            },
            function(error, response, body) {
                try {
                    expect(response.statusCode).toBe(200);
                    expect(body.title).toBe("TitleTest");
                    expect(body.description).toBe("This is my test description");
                    done();
                } catch (e) {
                    self.fail(Error(e));
                    done();
                }
            });
    });

    it("should delete the task id 1", function(done) {
        var self = this;
        request.del({
            url: tasksUrl + "/1",
            json: true
        }, function(err, response, body) {
            try {
                expect(response.statusCode).toBe(204);
                done();
            } catch (e) {
                self.fail(Error(e));
                done();
            }
        });
    });
});