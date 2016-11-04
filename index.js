"use strict";
module.change_code = 1;
var _ = require("lodash");
var Skill = require("alexa-app");
var ISDSbot = new Skill.app("ISDSbot");
var ConsultHelp = require('./consultant_helper.js');
var jsonfile = require('jsonfile')
var jsonQuery = require('json-query')
var entities = require('./knowledge_paths.js');
var jd = require('jsdataframe');

var facts = {
    students: [
      "Students pursuing a Bachelor's degree in I.S.D.S. can choose to concentrate in either Business Intelligence or Information Technology ",
      "Did you know that there are currently 150 students in the I.S.D.S. program?",
      "The Association of Information Technology Professionals is a great organization for I.S.D.S. students to get inolved in",
      "I.S.D.S. students that study abroad are highly competitive in the global market",
      "85 percent of I.S.D.S. students have full time job offers within 6 months of graduation"],
    professors: [
      "Did you know that some of the I.S.D.S. professors are alumni of L.S.U.?",
      "The I.S.D.S. department has a diverse faculty from 24 cities and 7 different countries",
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


var concentrations = {
  technology: [
  "Technical Track",
  "The Technical Track prepares you for a career in the IT department of large organizations. You will create software applications, manage databases and maintain the technology that makes a modern business run."
  ],
  consulting: [
  "Managerial and Consulting Track",
  "The Managerial tracks prepares you for a career in IT management or consulting. You will help organizations create value with technology and will remain at the forefront of IT innovation.",
  ],
  cybersecuriy: [
  "Internal Audit and Cybersecurity Track",
  "The Internal Audit and Cybersecurity Track prepares you for a career in security and risk management. You will help organizations understand and manage the increasing risks associated with IT espionage and cyberthreats."
  ],
  analytics: [
  "Analytics Track",
  "The analytics track prepares you for a career as a data scientist or analyst. You will help organizations extract value from the data they create and collect. The analysis of Big Data and data streams will be your focus."
  ]
};


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
        var speechOutput = "hi " + name + ". I can help you in choosing you're concentration, I can give you random interesting facts, or you can ask me about specific professors";
      }else 
      {
        var speechOutput = "I didn't catch that. what's your're name";
      }
  	
  	//var repromptOutput = "try saying: i am, followed by your name";
  
    response.session("NAME", name);
    response.say(speechOutput).shouldEndSession(false);
    //response.reprompt(repromptOutput).shouldEndSession(false)
    }

    if(prev_name) {
      var speechOutput = "i already know your name " + prev_name + "!. if you want to start over the conversation just say start over, or restart";
      var repromptOutput = "i already know your name " + prev_name + "!. if you want to start over the conversation just say start over, or restart";
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
  "help me deciding what concentration {do | take |}",
  "give me advice about {my |} career path",
  "help me deciding a carreer path"
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
  "who is {professor | doctor | dott | mister | miss |} {-|ENTITY}",
  "tell me about {professor | doctor | dott | mister | miss |} {-|ENTITY}",
  "what is {the |} {-|ENTITY}",
  "what does the {-|ENTITY} {do |}"
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


ISDSbot.intent("AMAZON.HelpIntent", 
  {},
  function(request, response) {
    speechOutput = "as the I.S.D.S assistant I can help students selecting a concentration. Furthermore, I have limited knowledge about the departments professors. You can also ask me for a random fact";
    response.say(speechOutput).shouldEndSession(false);
    response.reprompt(speechOutput).shouldEndSession(false);
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
    //var speechOutput = "You can ask me about students, professors, the business school, and the department";
    var speechOutput = "You can ask me for a random fact"
    var repromptOutput = "Try asking me a random fact";
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
  response.session("STEPLENGTH",stepLength)
};

function onLaunch(request, response) {
    var speechOutput = "Hi there! I'm the the I.S.D.S assistant. I'm here to help you. What's your name?";
    var repromptOutput = "Sorry, I didn't catch that. What's you're name?";

    response.say(speechOutput).shouldEndSession(false);
    response.reprompt(repromptOutput).shouldEndSession(false);
    response.card({
      type: "Simple",
      title: "Available functionalities",  //this is not required for type Simple OR Standard 
      content:  "These are my core functionalities: \n 1-Give facts about students, the department, the business school, and ISDS professors \n 2-Suggest ISDS courses and career paths"
});
};

var sum = function(arr) {
  return arr.reduce(function(a, b){ return a + b; }, 0);
};

function determineCareerPath(request, response) {
  var jsonRequest = request.data
  var last_intent = request.session("LAST_INTENT")
  var consultHelperData = request.session("CONSULT_DATA")

  var weight = []
 
  for (var i = 0; i < consultHelperData.consultant[0].steps.length; i++) {
    if (consultHelperData.consultant[0].steps[i].value == true) {
    weight[i] = consultHelperData.consultant[0].steps[i].weight
    }
  }
 
  var tech = []
  var con = []
  var cyb = []
  var bi = []

  var test = weight.map(function(row, i) {
    tech[i] = row[0]
    con[i] = row[1]
    cyb[i] = row[2]
    bi[i] = row[3]
  });

  var tech = sum(tech)
  var con = sum(con)
  var cyb = sum(cyb)
  var bi = sum(bi)

  var result = [tech,con,cyb,bi]
  var result = jd.df([ result, ['technology', 'analytics', 'cybersecuriy', 'consulting']],['value','category']);
  var result = result.sort('value');
  var result =result.s(-1);
  var result = result.toObjArray()[0];

  if(result.value != 0) {
    var speechOutput = "It looks like your interestest are a good match to the " + concentrations[result.category][0] + ".  " + concentrations[result.category][1]
    response.say(speechOutput).shouldEndSession(false)
  };
  if(result.value == 0) {
    speechOutput = "Unfortunately your interest are not a good match to the I.S.D.S concentrations. But I'm sure there's something you like out there, go for it!"
    response.say(speechOutput).shouldEndSession(false)
  }
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

  if(queryResult.value != null) {
    var entityData = require("./Knowledge_base/"+queryResult.value.path+".json");
    var speechOutput = entityData.description;
    response.session("PATH", queryResult.value.path)
    response.say(speechOutput).shouldEndSession(false);
  }
  if(queryResult.value == null) {
    var speechOutput = "sorry, I don't have an answer to that question"
    response.say(speechOutput).shouldEndSession(false);
  } 
}

//export the ISDSbot module
module.exports = ISDSbot;