/**
 * Task model - id (integer)
 *              title(text)
 *              description (text)
 *
 *
 * ================== APIs To be implemented ==================
 *
 * 1. GET /tasks
 *
 * Retrieve all the students from the database.
 *
 * Sample response: [{
 *      id: 10,
 *      title: "title1",
 *      description : "Complete Mission RnD Sample Test"
 * }, {
 *      id: 11,
 *      title: "title1",
 *      description : "I will code well daily"
 * },{
 *      id: 12,
 *      title: "title1",
 *      description : "I wont copy"
 * },]
 *
 *
 * 3. GET /tasks/:id
 *
 * Sample request: GET /tasks/10 - Retrieve task with id 10.
 *
 * Sample response :  {
 *      id: 10,
 *      title: "title1",
 *      description : "Complete Mission RnD Sample Test"
 * }
 *
 * 4. POST /tasks - Create a task record.
 *
 * Sample request body - {
 *      id: 10,
 *      title: "title1",
 *      description : "Complete Mission RnD Sample Test"
 * }
 *
 * 5. PUT /tasks/:id
 *
 * Sample request: PUT /tasks/10 - Updates tasks with id 10.
 *
 * Sample request body - {
 *      description : "Complete Mission RnD Sample Test - UPDATED"
 * }
 * 6. DELETE /tasks/:id
 *
 * Sample request: DELETE /tasks/10 - Deletes tasks with id 10.
 *
 * Error cases:
 *
 * 1. For GET, PUT and DELETE operations /tasks/:id , If the task is not available with given id, return 404. (Not found)
 *
 * 2. For POST /tasks, if duplicate id found, return 400 (Bad request).
 *
 * Success http responses:
 *
 * 1. GET operations
 *      a. Return 200 if Operation succeeds.
 *      b. Return 400 in case of invalid requests.
 *
 * 2. POST operations
 *      a. Return 202 (Created) if operation suceeds.
 *      b. Return 400 in case of invalid request.
 *
 * 3. PUT Operations
 *      a. Return 204 (No Content) if operation succeeds.
 *      b. Return 400 in case of invalid request.
 *      c. Return 404 in case of Not found.
 *
 * 4. DELETE Operations
 *      a. Return 204 (No Content) if operation succeeds.
 *      b. Return 400 in case of invalid request.
 *      c. Return 404 in case of Not found.
 *
 */
var tasks = require('./routes/tasks');

var server = app.listen(3001, function () {
    var port = server.address().port;
    console.log("Example app listening at port %s", port)
});
