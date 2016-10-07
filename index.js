"use strict";
module.change_code = 1;
var _ = require("lodash");
var Skill = require("alexa-app");
var ISDSbot = new Skill.app("ISDSbot");



//var MadlibHelper = require("./madlib_helper");

ISDSbot.launch(function(request, response) {
    var speechOutput = "Hi! I'm the the I.S.D.S assistant. I'm here to help you. What's your name?";
    var repromptOutput = "Sorry, I didn't catch that. Say, my name is";

    response.say(speechOutput).shouldEndSession(false);
    response.reprompt(repromptOutput).shouldEndSession(false);

});


module.exports = ISDSbot;
