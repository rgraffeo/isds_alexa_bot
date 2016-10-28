"use strict";
module.change_code = 1;
var _ = require("lodash");
var Skill = require("alexa-app");
var ISDSbot = new Skill.app("ISDSbot");
var ConsultHelp = require('./consultant_helper.js');
var jsonfile = require('jsonfile')
var jsonQuery = require('json-query')
var entities = require('./knowledge_paths.js');

//var file = jsonfile.readFileSync("./Knowledge_base/piccoli.json");

var facts = {
    students: [
      "Students pursuing a Bachelor's degree in I.S.D.S. can choose to concentrate in either Business Intelligence or Information Technology ",
      "Did you know that there are currently _ students in the I.S.D.S. program?",
      "The Association of Information Technology Professionals is a great organization for I.S.D.S. students to get inolved in",
      "I.S.D.S. students that study abroad are highly competitive in the global market",
      "_% of I.S.D.S. students have full time job offers within 6 months of graduation"],
    professors: [
      "Did you know that _ of the I.S.D.S. professors are alumni of L.S.U.?",
      "The I.S.D.S. department has a diverse faculty from _ cities and _ different countries",
      "The I.S.D.S. faculty have expertise in various domains like e-commerce, medical informatics, quantitative modeling, and more ",
      "Many of the faculty members in I.S.D.S. are published in magazines, academic journals, and textbooks "],
    department: [
      "The I.S.D.S. department offers a Bachelor of Science in I.S.D.S., a Master of Science in Analytics and a PhD in I.S.D.S.",
      "The I.S.D.S. department connects students to a career network that provides opportunities for students during and after college",
      "The department of Information Systems and Decision Sciences prepares students to design, implement, analyze, and manage information technology",
      "The I.S.D.S. department strives to accomplish research that makes significant contributions to the advancement of knowledge"],
    'business school': [
      "the Business Education Complex is among the top 10 business school facilities in the country",
      "the B.E.C. is a state of the art facility with a four-story rotunda, a 300 seat auditorium, and classrooms equipped with the latest technology",
      "The Business Education Complex has been home to the E.J. Ourso School of Business since 2012",
      "the B.E.C. is a 60 million dollar facility making it the largest public and private capital investment in the history of LSU"]    
};    


//var MadlibHelper = require("./madlib_helper");

//on launch intent
ISDSbot.launch(function(request, response) {
  return onLaunch(request,response)
});

//skill's intents

//catch user's name
ISDSbot.intent("sayName", {
  "slots": {
    "NAME": "AMAZON.US_FIRST_NAME"
  },
  "utterances": [
  "my name is {-|NAME}",
  "they call me {-|NAME}",
  "i go by {-|NAME}",
  "call me {-|NAME}",
  "i am {-|NAME}",
  "{-|NAME} is the name I go by"
  ]
  },
  function(request, response) {
    var name = request.slot("NAME");
    var prev_name = request.session("NAME")
    var last_intent = request.session("LAST_INTENT")

    if(!prev_name) 
    {
      if(name) 
      {
        var speechOutput = "hi " + name + ". my knowledge is limited at the moment. To know more about what I can do for you ask for help";
      }else 
      {
        var speechOutput = "my knowledge is limited at the moment. To know more about what I can do for you ask for help";
      }
  	
  	var repromptOutput = "try saying: i am, followed by your name";
  
    response.session("NAME", name);
    response.say(speechOutput).shouldEndSession(false);
    response.reprompt(repromptOutput).shouldEndSession(false)
    }

    if(prev_name) {
      var speechOutput = "i already know your name " + prev_name + "!. if you want to start over the conversation just say start over, or restart"
      var repromptOutput = "i already know your name " + prev_name + "!. if you want to start over the conversation just say start over, or restart"
      response.say(speechOutput).shouldEndSession(false)
    }
    }
);

//manage general info requests
ISDSbot.intent("generalInfo", {
  "slots": {
    "INFOCAT": "INFOCAT"
  },
  "utterances": [
   "{give me| tell me | } {a| }  {fun | nice | interesting |} {fact} {about| } {-|INFOCAT}", 
   "{give me| tell me | } {a| } {-|INFOCAT} {fact}",
   "{try |} {give| giving| } {me |} {general } {facts}",
   "what can you tell me",
   ]
},
  function(request, response) {
    //call the info function
    return generalInfo(request,response);
    }
);

//course advisor intent
ISDSbot.intent("courseAdvisor", {
  "utterances": [
  "{give|suggest|offer} {me|us} {advice|counceling|suggestions}",
  "{suggest} {me|us} a career path"
  ]
},
  function(request, response) {
    return courseAdvisor(getConsultHelp(request), request, response);
    }
);

ISDSbot.intent("queryKnowledgeBase", {
  "slots": {
    "ENTITY": "ENTITY"
  },
  "utterances": [
  "who is {-|ENTITY}"
  ]
},
  function(request, response) {
    return queryKnowledgeBase(request, response);
    }
);

//Amazon built in YES intent
ISDSbot.intent("AMAZON.YesIntent", 
  {},
  function(request, response) {
    var jsonRequest = request.data
    var last_intent = request.session("LAST_INTENT")
    var consultHelperData = request.session("CONSULT_DATA")
    var current_intent = jsonRequest.request.intent.name

    if(last_intent == "courseAdvisor") {
      var currentStep = consultHelperData.currentStep
      consultHelperData.consultant[0].steps[currentStep].value = true
      consultHelperData.currentStep ++
      return courseAdvisor(consultHelperData, request, response)
    }
    
    if(last_intent == "generalInfo") {
      return generalInfo(request, response)
    }
    //response.say(speechOutput).shouldEndSession(false);
    }
);

ISDSbot.intent("AMAZON.NoIntent", 
  {},
  function(request, response) {
    var jsonRequest = request.data
    var last_intent = request.session("LAST_INTENT")
    var consultHelperData = request.session("CONSULT_DATA")
    var current_intent = jsonRequest.request.intent.name

    if(last_intent == "courseAdvisor") {
      var currentStep = consultHelperData.currentStep
      consultHelperData.consultant[0].steps[currentStep].value = false
      consultHelperData.currentStep ++
      return courseAdvisor(consultHelperData, request, response)
    }
    
    if(last_intent == "generalInfo") {
      var speechOutput = "can I do something else for you? You can stop me by saying exit"
      response.say(speechOutput).shouldEndSession(false)
    }
    
    }
);


ISDSbot.intent("AMAZON.CancelIntent", 
  {},
  function(request, response) {
    var name = request.slot("NAME");
    if(name) {
      var speechOutput = name + ", nice talking to you. Bye!"
    } else {
      var speechOutput = "nice talking to you. Bye!"
    }
    
    response.say(speechOutput).shouldEndSession(true)
    }
);

ISDSbot.intent("AMAZON.StopIntent", 
  {},
  function(request, response) {
    var name = request.slot("NAME");
    if(name) {
      var speechOutput = name + ", nice talking to you. Bye!"
    } else {
      var speechOutput = "nice talking to you. Bye!"
    }
    
    response.say(speechOutput).shouldEndSession(true)
    }
);

ISDSbot.intent("AMAZON.StartOverIntent", 
  {},
  function(request, response) {
      response.clearSession();
      return onLaunch(request,response)
    }
);

//application functions

function generalInfo(request, response) {
//var name = request.session("NAME");
  var jsonRequest = request.data
  var infocat = request.slot("INFOCAT");
  if(!infocat) {var infocat = request.session("INFOCAT")}
  var last_intent = request.session("LAST_INTENT")
  //var current_intent = jsonRequest.request.intent.name
  var current_intent = "generalInfo"

  if (infocat == "students" || infocat == "department" || infocat == "professors" || infocat == "business school") {
    var speechOutput = facts[infocat][randomNumber(4)];
    var repromptOutput = "Do you want to hear another fact about " + infocat + "?";
    response.session("INFOCAT", infocat).shouldEndSession(false);
    response.say(speechOutput).shouldEndSession(false);
    response.reprompt(repromptOutput).shouldEndSession(false);
    }
  if (infocat == "random") {
    var outputCat = Object.keys(facts)[randomNumber(4)];
    var speechOutput = facts[outputCat][randomNumber(4)]; 
    var repromptOutput = "Do you want to hear another " + infocat + " fact?";
    response.session("INFOCAT", infocat).shouldEndSession(false);
    response.say(speechOutput).shouldEndSession(false);
    response.reprompt(repromptOutput).shouldEndSession(false);
    }
  if (!infocat) {
    var speechOutput = "You can ask me about students, professors, the business school, and the department";
    var repromptOutput = "Try asking me a random fact maybe";
    response.say(speechOutput).shouldEndSession(false);
    response.reprompt(repromptOutput).shouldEndSession(false);
  }
  response.session("LAST_INTENT",current_intent)
};


var getConsultHelp = function(request) {
  var consultHelperData = request.session("CONSULT_DATA");
  if (consultHelperData === undefined) {
    consultHelperData = {};
  }
  return new ConsultHelp(consultHelperData);
};

function courseAdvisor(consultHelp,request, response) { 
  var jsonRequest = request.data
  var last_intent = request.session("LAST_INTENT")
  //var current_intent = jsonRequest.request.intent.name;
  var current_intent = "courseAdvisor"

  var name = request.session("name");

  //response.session("startedAdvisor", startedAdvisor)
  var stepValue = consultHelp.currentStep;
  var stepLength = consultHelp.consultant[0].steps.length;

  if(consultHelp.started == false) {
    consultHelp.started = true;
    consultHelp.index = 0;
    var speechOutput = consultHelp.consultant[0].init;
    response.say(speechOutput).shouldEndSession(false);
    response.session("CONSULT_DATA",consultHelp)
  }
  
  if(consultHelp.started == true && stepValue <= stepLength-1) {
    var speechOutput = consultHelp.consultant[0].steps[stepValue].promt
    var repromptOutput = "Sorry, I didn't catch that. " + consultHelp.consultant[0].steps[stepValue].promt
    response.say(speechOutput).shouldEndSession(false)
    response.reprompt(repromptOutput).shouldEndSession(false)
    //consultHelp.currentStep ++
    response.session("CONSULT_DATA",consultHelp)
  }

  if(consultHelp.started == true && stepValue >= stepLength) {
    //response.session("CONSULT_DATA",consultHelp)
    return determineCareerPath(request, response)
  }

  response.session("LAST_INTENT",current_intent)
};

function onLaunch(request, response) {
    var speechOutput = "Hi there! I'm the the I.S.D.S assistant. I'm here to help you. What's your name? Say: my name is, followed by your name";
    var repromptOutput = "Sorry, I didn't catch that. Say: my name is, followed by your name";

    response.say(speechOutput).shouldEndSession(false);
    response.reprompt(repromptOutput).shouldEndSession(false);
    response.card({
      type: "Simple",
      title: "Available functionalities",  //this is not required for type Simple OR Standard 
      content:  "These are my core functionalities: \n 1-Give facts about students, the department, the business school, and ISDS professors \n 2-Suggest ISDS courses and career paths"
});
};


function determineCareerPath(request, response) {
    var jsonRequest = request.data
    var last_intent = request.session("LAST_INTENT")
    var consultHelperData = request.session("CONSULT_DATA")

    //var answer = consultHelperData.consultant[0].steps.map(function(a) {return a.value;});
    //var category = consultHelperData.consultant[0].steps.map(function(a) {return a.value;});
    //var agg = aggregate(consultant_helper.consultant[0].steps, "category", "value", add);
    //response.say(agg)
    //var current_intent = jsonRequest.request.intent.name
    response.session("CONSULT_DATA", consultHelperData).shouldEndSession(false)
    response.say(", you seem to like everything, you should do a P.H.D")
  
};


function randomNumber(max) {
	var randomNum = Math.floor(Math.random() * max);
	return randomNum
};


function aggregate(object, toGroup, toAggregate, fn, val0) {
    function deepFlatten(x) {
        if ( x[toGroup] !== undefined ) // Leaf
            return x;
        return _.chain(x)
                .map(function(v) { return deepFlatten(v); })
                .flatten()
                .value();
    }

    return _.chain(deepFlatten(object))
            .groupBy(toGroup)
            .map(function(g, key) {
                return {
                    type: key,
                    val: _(g).reduce(function(m, x) {
                        return fn(m, x[toAggregate]);
                    }, val0 || 0)
                };
            })
            .value();
};

function add(a,b) { return a + b; }


function queryKnowledgeBase(request, response) {
  var jsonRequest = request.data
  var entity = request.slot("ENTITY");
  var entity = _.lowerCase(entity)
 
  var queryResult = jsonQuery("[entity="+entity+"]", {
  data: entities
  });

  // response.session("EMPTY",queryResult.value);
  // response.session("FILL",queryResult.value.path);
  if(entity) {
    var entityData = require("./Knowledge_base/"+queryResult.value.path+".json");
    var speechOutput = entityData.description;
    response.say(speechOutput).shouldEndSession(false);
  }
  if(!entity) {
    var speechOutput = "sorry, I don't have an answer to that question"
    response.say(speechOutput).shouldEndSession(false);
  }
    
}

//export the ISDSbot module
module.exports = ISDSbot;