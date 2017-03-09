var theConnection = null;
var mysql = require("mysql");

/**
 * Method is used to create a connection to the database.
 * @param dbconfig - contains host, port, database, user and password.
 * @returns {*} connection
 */
exports.getConnection = function(dbconfig) {
    if(dbconfig["host"] && dbconfig["port"] && dbconfig["database"]
            && dbconfig["user"] && dbconfig["password"]) {
        
        theConnection = mysql.createConnection(dbconfig);
    }
    return theConnection;

};

/**
 * Method is used to terminate the database connection
 */
exports.endConnection = function() {
    if(theConnection != null) {
        theConnection.end();
    }
    theConnection = null;
};

/**
 * Method is used to retrieve the dbConfig used to connect to a database
 * @returns {{host: string, user: string, password: string, database: string, port: number}}
 */
exports.getDBConfig = function() {
    return {
        host: "127.0.0.1",
        user: "root",
        password: "password",
        database: "nodejs",
        port: 3306
    };
};

