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
        weight: [1,0.8,0.5,0],
  			promt: "are you interested in programming or user interfaces design?",
        category: "IT",
  			help: "programming is a process that leads from an original formulation of a computing problem to executable computer programs"
  		},
  		{
  		  value: null,
        weight: [0.5,1,0.5,0.2],
  			promt: "are you exited about IT innovation and its business applications?",
        category: "IT",
  			help: "do you like quantitave courses?"	
  		},
  		{
  			value: null,
        weight: [0,0.5,0,1],
  			promt: "do you want to build business intelligence and analytical skills?",
        category: "BI",
  			help: "do you like  subjects?"
  		}/*,
      {
        value: null,
        promt: "are you interested in building database management systems or other sofware applications?",
        category: "IT",
        help: "would you like to challenge yourself and learn how to program?"
      },
      {
        value: null,
        promt: "do you want to investigate what is big data and learn how to extract actionable information from it?",
        category: "BI",
        help: "would you like to challenge yourself and learn how to program?"
      },
      {
        value: null,
        promt: "do you want to understand industry specific analytics in marketing, healthcare, and telecommunications?",
        category: "BI",
        help: "would you like to challenge yourself and learn how to program?"
      }
*/
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