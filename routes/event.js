/**
 * Created by manu on 24/8/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var EventModel = require('../models/eventSchema');

function getMSG(counter, fail, result, msg) {
    var STAT = null;
    if(fail == 0) STAT = 'SUCCESS';
    else if(fail == counter.length) STAT = 'ERROR';
    else STAT = 'WARNING';
    var MSG = {
        "Status" : STAT,
        "Pass Count" : counter.length - fail,
        "Fail Count" : fail,
        "Message" : (counter.length - fail) + " test case(s) have been " + msg + "."
    };
    if(result.length > 0)
        MSG["Details"] = result;
    return MSG;
}
/* GET home page. */

router.get('/', function(req, res, next) {
    EventModel.find({}, function(err, events) {
        if(err) {
            console.log(err);
            res.status(400).json(err);
        }
        else {
            res.status(200).json(events);
        }
    });
});

router.post('/', function(request, response, next) {
    if(request.body.length > 0) {
        callPostMultiple(request, response);
    }
    else {
        request.body = new Array(request.body);
        callPostMultiple(request, response);
    }
});

function callPostMultiple(request, response) {
    var result = [];
    var fail = 0;
    var counter = [];
    var status = 201;
    for(i = 0; i < request.body.length; ++i) {
        if(request.body[i]["Latitude"] == undefined || request.body[i]["Longitude"] == undefined || request.body[i]["x"] == undefined || request.body[i]["y"] == undefined || request.body[i]["z"] == undefined || request.body[i]["Time"] == undefined) {
            ++fail;
            result[result.length] = { message:"Latitude, Longitude, x, y, z and Time must be defined in JSON body" };
            counter.push(true);
            if(counter.length === request.body.length) {
                response.status(status).json(getMSG(counter, fail, result, "created"));
            }
        }
        else {
            var eventModel    = new EventModel();   // create a new instance of the test case model
            eventModel.lat    = request.body[i]["Latitude"];
            eventModel.long   = request.body[i]["Longitude"];
            eventModel.x      = request.body[i]["x"];
            eventModel.y      = request.body[i]["y"];
            eventModel.z      = request.body[i]["z"];
            eventModel.time   = request.body[i]["Time"];
            eventModel.save(function(err) {
                if (err) {
                    result[result.length] = err;
                    log.error("POST ERROR: " + err);
                    console.log("POST ERROR: " + err);
                    status = 400;
                    ++fail;
                }
                counter.push(true);
                if(counter.length === request.body.length) {
                    response.status(status).json(getMSG(counter, fail, result, "created"));
                }
            });
        }
    }
}

module.exports = router;
