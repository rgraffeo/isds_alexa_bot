'use strict';
module.change_code = 1;
var _ = require('lodash');

function ConsultHelp(obj) {
	  this.started = false;
  	this.index = 0;
  	this.currentStep = 0;
  	this.consultant = [
  	{	
  		init: "i'll ask you some information in order to suggest you the best course tailored for your skills" + ". Please answer saying yes, or no. lets start with the first one.",
  		steps: [
  		{
  			value: null,
  			promt: "are you interested in programming?",
        category: "programming",
  			help: "programming is a process that leads from an original formulation of a computing problem to executable computer programs"
  		},
  		{
  		  value: null,
  			promt: "do you want to learn more about Big Data?",
        category: "dataAnalysis",
  			help: "do you like quantitave courses?"	
  		},
  		{
  			value: null,
  			promt: "do you want to learn how to analyze, design, and implement systems to support the operations and management functions of an organization?",
        category: "strategy",
  			help: "do you like finalcial subjects?"
  		},
      {
        value: null,
        promt: "would you like to know how to strategically leverage technology inside organizations?",
        category: "strategy",
        help: "would you like to challenge yourself and learn how to program?"
      }      

  		]
  	}

  	];
    for (var prop in obj) this[prop] = obj[prop];
}

    

module.exports = ConsultHelp;


/*
var consultHelp = new ConsultHelp()
console.log(consultHelp.consultant[0].steps.length)

var data = consultHelp.consultant[0].steps
//console.log(data)
//console.log(_.filter(data, function(o) { return !o.promt; }));
console.log(_.filter(data, ["value", null]));


var consultHelp = new ConsultHelp()
console.log(consultHelp.started == false)
console.log(typeof(consultHelp))
console.log(consultHelp.consultant[0].steps.length)

var stepValue = consultHelp.currentStep
var speechOutput = consultHelp.consultant[0].steps[0].promt
console.log(speechOutput)
*/