/**
 * Created by manu on 24/8/15.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var eventSchema   = new Schema({
    lat : { type : String, required : true },
    long : { type : String, required: true },
    x : { type: String },
    y : { type: String },
    z : { type: String },
    time : {type: String}
});

module.exports = mongoose.model('Event', eventSchema);
