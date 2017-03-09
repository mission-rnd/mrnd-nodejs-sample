var sqlHelper = require("./sqlHelper");
/**
 * Write up methods to perform operations on tasks table.
 */

/**
 * Method is used to retrieve all the tasks..
 * @param callback callback handler with error and result.
 */
exports.getTasks = function(callback) {
    sqlHelper.getAllByFilter("tasks", null, callback);
};

/**
 * Method is used to get task with given id.
 * @param id Id to the task
 * @param callback callback handler with error and result.
 */
exports.getTaskById = function(id, callback) {
    var whereClause = [{
        column : "id",
        value : parseInt(id)
    }];
    var filters = {};
    filters.whereClause = whereClause;

    sqlHelper.getAllByFilter("tasks", filters, callback);
};

/**
 * Method is used to update a task with given id.
 * @param id Id to the task
 * @param task json object having tasks fields to be updated ("title", "descriptions")
 * @param callback callback handler with error and result.
 */
exports.updateTaskById = function(id, task, callback) {
    var whereClause = [{
        column : "id",
        value : parseInt(id)
    }];
    var filters = {};
    filters.whereClause = whereClause;

    sqlHelper.updateRecordHelper("tasks", filters, task, callback);
};

/**
 * Method is used to delete a given task
 * @param id Id to the task
 * @param callback callback handler with error and result.
 */
exports.deleteTaskById = function(id, callback) {
    var whereClause = [{
        column : "id",
        value : parseInt(id)
    }];
    var filters = {};
    filters.whereClause = whereClause;

    sqlHelper.deleteRecordHelper("tasks", filters, callback);
};

/**
 * Method is used to delete a task.
 * @param task json object having tasks fields ("id, tasks", "descriptions")
 * @param callback callback handler with error and result.
 */
exports.createTask = function(task, callback) {
    sqlHelper.createRecordHelper("tasks", task, callback);
};

/**
 * Method is used to create the table for tasks
 * @param callback callback handler with error and result.
 */
exports.setupTasksTable = function (callback) {
    sqlHelper.executeSQL("create table if not exists tasks (id integer, title text, description text);", null, callback);
};