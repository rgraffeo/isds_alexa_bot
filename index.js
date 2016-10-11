"use strict";
module.change_code = 1;
var _ = require("lodash");
var Skill = require("alexa-app");
var ISDSbot = new Skill.app("ISDSbot");

var facts = {
    students:   [
            "we have the tallest and arguably nicest phd students of the hole business school",
            "we love to work from home during weekends",
            "the business school is our second home",
            "we pretend to know about computers and business",
            "the I.S.D.S students get good jobs",
            "the I.S.D.S students get the highest salary in the business school"],
    professors: [
            "I.S.D.S professors publish a lot",
            "I.S.D.S professors love to teach",
            "I.S.D.S professors engage in very interesting projects",
            "I.S.D.S professors like to work with students one on one",
            "I.S.D.S professors are fun people",
            "I.S.D.S professors work hard and play harder"],
    courses: [
            "I.S.D.S courses prepare you for a great career",
            "idsds courses are challenging but fun",
            "many students from other departments take I.S.D.S courses ",
            "I.S.D.S courses are hands on and provide with grat skills",
            "I.S.D.S courses are both technical and strategic",
            "I.S.D.S courses will get you a job"]
    };


//var MadlibHelper = require("./madlib_helper");

ISDSbot.launch(function(request, response) {
    var speechOutput = "Hi! I'm the the I.S.D.S assistant. I'm here to help you. What's your name?";
    var repromptOutput = "Sorry, I didn't catch that. Say, my name is";

    response.say(speechOutput).shouldEndSession(false);
    response.reprompt(repromptOutput).shouldEndSession(false);

});

ISDSbot.intent("sayName", {
  "slots": {
    "NAME": "AMAZON.US_FIRST_NAME"
  },
  "utterances": ["{My|They|I|begin|build} {|name|call|am|} {is|me|called} {-|NAME}", "{-|NAME}"]
},
  function(request, response) {

  	var speechOutput = "Hi " + name + ". Do you want advice for I.S.D.S courses, or do you want to know general info about the department?";
  	var repromptOutput = "Ask me for courses' advice, or for general information"
    var name = request.slot("NAME");
    response.session("NAME", name);
    response.say(speechOutput).shouldEndSession(false);
    }
);

ISDSbot.intent("info", {
  "slots": {
    "INFOCAT": "CustomSlotType"
  },
  "utterances": [
   "{Give me| Tell me | } {a| } {fun | nice | interesting |} {fact} {about| } {-|INFOCAT}", "{-|INFOCAT}",
   "what can you tall me"]
},
  function(request, response) {

  	//var name = request.session("NAME");
  	var infocat = request.slot("INFOCAT")
  	
  	if (infocat) {
  		if (infocat == "students" | infocat == "professors") {
  			var speechOutput = facts[infocat][randomNumber(6)];
  			
  	} else if (infocat == "random") {
  			var outputCat = Object.keys(facts)[randomNumber(3)];
  			var speechOutput = facts[outputCat][randomNumber(6)];	
  	}
  	
  	response.say(speechOutput);
  	response.session("INFOCAT", infocat);
	
	} else {
	var speechOutput = "You can ask me me about students, professors, courses";
	response.say(speechOutput).shouldEndSession(false);
  	}
    }
);

function randomNumber(max) {
	var randomNum = Math.floor(Math.random() * max);
	return randomNum
};

module.exports = ISDSbot;