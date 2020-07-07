
/* Load an sql file with the commands to create our tables */
 function  initScheme(schemeFile){
  console.log('Running sql file: '+schemeFile);
  var fs = require('fs'),
      path = require('path'),    
      filePath = path.join(__dirname, schemeFile);

    fs.readFile(filePath, {encoding: 'utf-8'},  async function(err,data){
      if (!err) {
        knex.raw(data)
        .then((success) => {console.log('...success.');{knex.destroy()}})
        .catch((err) => {console.log(err)})
      } else {
        console.log(err);
      }
  })
};

console.log(process.argv[1]);

var filename = process.argv[2];
var dburl = process.argv[3];

var knex = require('knex')({
    client: 'pg',
    debug: false,
    connection: dburl,
    searchPath: ['knex', 'public'],
  });
  

initScheme(filename);





