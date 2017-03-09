/**
 * Created by Krishna Nikhil Vedurumudi on 12-02-2016.
 */

var format = require("util").format;


var mysql = require('mysql');

var databaseHelper = require('./databaseHelper');


exports.createWhereClause = function(filterColumns, params) {
    var whereClause = "";
    params.push(filterColumns[0].value);
    whereClause = format("WHERE %s = ?", filterColumns[0].column);
    for(var i = 1; i < filterColumns.length; i++) {
        params.push(filterColumns[i].value);
        var compType = filterColumns[i].compType;
        if(!compType) {
            compType = "AND";
        }
        whereClause = format("%s %s %s = ?", whereClause, compType ,filterColumns[i].column);
    }
    return whereClause;
};

/**
 * Method is used to create a Insert SQL query.
 * @param tablename {String} name of the database table.
 * @param values {JSON} values which needs to be inserted into the table.
 * @returns {JSON} containing sql and params. null if irrelevant params are passed.
 */
exports.createInsertQuery = function(tablename, values) {
    if(typeof(tablename) === "string" && typeof(values) === "object") {
        var columns = Object.keys(values);
        var paramsString = columns[0];
        var valuesString = "?";
        var params = [values[columns[0]]];
        for (var i = 1; i < columns.length; i++) {
            paramsString = paramsString + "," + columns[i];
            valuesString = valuesString + ",?";
            params.push(values[columns[i]]);
        }
        var insertSQL = format("INSERT INTO %s(%s) values(%s)", tablename, paramsString, valuesString);
        return {sql : insertSQL, params : params};
    } else {
        return null;
    }
};

/**
 * Method is used to create update SQL for given table.
 * @param tablename {String} name of the table.
 * @param filters {JSON} values which will be added in where clause of sql.
 * @param values {JSON} values which will be added in set clause of sql.
 * @returns {JSON} containing sql and params. null if irrelevant params are passed.
 */
exports.createUpdateQuery = function(tablename, filters, values) {
    if(typeof(tablename) === "string" && typeof(values) === "object") {
        var columns = Object.keys(values);
        var paramsString = columns[0] + "= ?";
        var whereClause = "";
        var params = [values[columns[0]]];

        for (var i = 1; i < columns.length; i++) {
            paramsString = paramsString + "," + columns[i] + "= ?";
            params.push(values[columns[i]]);
        }

        if(filters && typeof(filters) === "object" && typeof(filters["whereClause"]) === "object") {
            var filterColumns = filters.whereClause;
            whereClause = exports.createWhereClause(filterColumns, params);
        }

        //adding aggregate operators support.
        //time_stamp = (Select min(time_stamp) from tablename);
        if(filters.aggregateOperators) {
            var aggregateOperators = filters.aggregateOperators;
            if(whereClause.length > 0) {
                whereClause = format("%s AND %s = (SELECT %s(%s) from %s)", whereClause, aggregateOperators["column"],
                    aggregateOperators["type"], aggregateOperators["column"], tablename);
            } else {
                whereClause = format("WHERE %s = (SELECT %s(%s) from %s)", whereClause, aggregateOperators["column"],
                    aggregateOperators["type"], aggregateOperators["column"], tablename);
            }
        }
        var updateQuery;
        if(whereClause.length > 0) {
            updateQuery = format("UPDATE %s SET %s %s", tablename, paramsString, whereClause);
        } else {
            updateQuery = format("UPDATE %s SET %s", tablename, paramsString);
        }

        return {sql: updateQuery, params: params};
    } else {
        return null;
    }
};

/**
 * Method is used to create delete SQL for given table.
 * @param tablename {String} name of the table.
 * @param filters {JSON} values to be added in where clause
 * @returns {JSON} containing sql and params. null if irrelevant params are passed.
 */
exports.createDeleteQuery = function(tablename, filters) {
    if(typeof(tablename) === "string") {
        var whereClause = "";
        var params = [];
        if(filters && typeof(filters) === "object" && typeof(filters["whereClause"]) === "object") {
            var filterColumns = filters.whereClause;
            whereClause = exports.createWhereClause(filterColumns, params);
        }
        var deleteQuery;
        if(whereClause.length > 0) {
            deleteQuery = format("DELETE FROM %s %s", tablename, whereClause);
        } else {
            deleteQuery = format("DELETE FROM %s", tablename);
        }
        return {sql: deleteQuery, params: params};
    } else {
        return null;
    }
};

/**
 * Method is used to create fetch SQL for given table.
 * @param tablename {String} name of the table.
 * @param filters {JSON} values to be added in where clause
 * @returns {JSON} containing sql and params. null if irrelevant params are passed.
 */
exports.createFetchQuery = function(tablename, filters, columns) {
    if(typeof(tablename) === "string") {
        var whereClause = "";
        var params = [];
        var columnStr = "";
        if(filters && typeof(filters) === "object" && typeof(filters["whereClause"]) === "object") {
            var filterColumns = filters.whereClause;
            whereClause = exports.createWhereClause(filterColumns, params);
        }

        if(columns === null || columns === undefined) {
            columnStr = "*";
        } else {
            columnStr = columns[0];
            for(var col = 1; col < columns.length; col++) {
                columnStr = format("%s, %s", columnStr, columns[col]);
            }
        }
        var fetchQuery;
        if(whereClause.length > 0) {
            fetchQuery = format("SELECT %s FROM %s %s",columnStr, tablename, whereClause);
        } else {
            fetchQuery = format("SELECT %s FROM %s",columnStr, tablename);
        }
        return {sql: fetchQuery, params: params};
    } else {
        return null;
    }
};


/**
 * Method is used to execute an sql statement on the postgres database.
 * @param sql {String} sql statement that needs to be executed.
 * @param params {Array} array of values to fill up the placeholders in sql.
 * @param callback {Function} callback handler with err and result objects.
 */
exports.executeSQL = function(sql, params, callback) {

    var connection = databaseHelper.getConnection(databaseHelper.getDBConfig());
    connection.query(sql, params,
        function(err, result){
            if(err){
                console.log(err);
            }
            databaseHelper.endConnection();
            callback(err,result);
        });
};

exports.createRecordHelper = function(table, values, callback) {
    try {
        var insertQuery = exports.createInsertQuery(table, values);
        console.log("insertquery ",insertQuery);
        if(insertQuery) {
            exports.executeSQL(insertQuery.sql, insertQuery.params, callback);
        } else {
            //TODO : throw error..
        }
    } catch(e) {
        console.log("caught here ",e);
    }

};

exports.deleteRecordHelper = function(table, filters, callback) {
    var deleteQuery = exports.createDeleteQuery(table, filters);
    console.log("deleteQuery ",deleteQuery);
    if(deleteQuery) {
        exports.executeSQL(deleteQuery.sql, deleteQuery.params, callback);
    } else {
        //TODO: throw error
    }
}

exports.updateRecordHelper = function(table, filters, values, callback) {
    var updateQuery = exports.createUpdateQuery(table, filters, values);
    console.log("updateQuery ",updateQuery);
    if(updateQuery) {
        exports.executeSQL(updateQuery.sql, updateQuery.params, callback);
    } else {
        //TODO : throw error..
    }
};

exports.getAllByFilter = function(table, filters, callback) {
    var fetchQuery = exports.createFetchQuery(table, filters);
    console.log("fetchquery ",fetchQuery);
    if(fetchQuery) {
        exports.executeSQL(fetchQuery.sql, fetchQuery.params, callback);
    } else {
        //TODO : throw error..
    }
};