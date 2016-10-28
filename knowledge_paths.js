var jsonQuery = require('json-query')

var entities = [
{
	"entity": "piccoli",
	"path": "piccoli"
},
{
	"entity": "rodriguez",
	"path": "rodriguez"
},
{
	"entity": "watson",
	"path": "watson"
},
{
	"entity": "edward watson",
	"path": "watson"
},
{
	"entity": "edward",
	"path": "watson"
},
{
	"entity": "i.s.d.s department",
	"path": "isdsdepartment"
},
{
	"entity": "information systems department",
	"path": "isdsdepartment"
},
{
	"entity": "information system department",
	"path": "isdsdepartment"
},
{
	"entity": "isds department",
	"path": "isdsdepartment"
}
];


module.exports = entities;

// var queryResult = jsonQuery("entity", {
//   data: entities
//   });

//console.log(queryResult.value);