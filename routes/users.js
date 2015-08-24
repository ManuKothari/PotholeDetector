var express = require('express');
var router = express.Router();
var EventModel = require('../models/eventSchema');
/* GET users listing. */
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

module.exports = router;
