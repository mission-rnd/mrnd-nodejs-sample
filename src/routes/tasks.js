var express = require('express');
var router = express.Router();
var tasks = require("./../models/tasks");

/**
 * This file will contain the methods to handle requests to /tasks url.
 *
 * Invoke appropriate methods from models/tasks file to perform corresponding DB operations.
 */
router.get('/', function (req, res, next) {
    //Return all tasks
    tasks.getTasks(function(err, result) {
        if(err != null) {
            res.sendStatus(400);
        } else {
            res.status(200).send(result);
        }
    });
});

router.get('/:id', function (req, res) {
    //Return a task
    tasks.getTaskById(req.params.id, function(err, result) {
        if(err != null) {
            res.sendStatus(400);
        } else if(result.length == 0) {
            res.sendStatus(404);
        } else {
            res.status(200).send(result[0]);
        }
    });
});

router.post('/', function (req, res) {
    //Create a task
    var task = req.body;
    tasks.createTask(task, function(err, result) {
        if(err != null) {
            res.sendStatus(400);
        } else {
            res.sendStatus(201);
        }
    });
});

router.put('/:id', function (req, res) {
    //Update a task
    var task = req.body;
    var id = req.params.id;
    tasks.updateTaskById(id, task, function(err, result) {
        if(err != null) {
            res.sendStatus(400);
        } else if(result.affectedRows == 0) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    });
});

router.delete('/:id', function (req, res) {
    //Delete a task
    var id = req.params.id;
    tasks.deleteTaskById(id, function(err, result) {
        if(err != null) {
            res.sendStatus(400);
        } else if(result.affectedRows == 0) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    });
});

module.exports = router;
