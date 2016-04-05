var fs = require('fs');
var path = require('path')
var $ = require('jQuery');

function refreshSnippets(projectsInWorkspace) {
  var snippetsArray = []
  for (var i = 0; i < projectsInWorkspace.length; i++) {
    try {
      var node_modules = fs.readdirSync(projectsInWorkspace[i] + '/node_modules')
    } catch (e) {
      console.log(projectsInWorkspace[i] + " does not have node_modules")
      continue
    }
    for (var j = 0; j < node_modules.length; j++) {
      if(!(node_modules[j].startsWith("ember-")))
        continue
      try {
        var module_package_json = JSON.parse(fs.readFileSync(projectsInWorkspace[i] +
                                                              '/node_modules/' +
                                                              node_modules[j] +
                                                              "/package.json"))
      } catch (e) {
        console.log("Something went wrong when opening " + node_modules[j])
        continue;
      }

      var atomSnippets = module_package_json.atomSnippets
      if(atomSnippets == undefined){
        continue;
      }else{
        snippetsArray.push(atomSnippets)
      }
    }
  }
  console.log(snippetsArray)
  if(snippetsArray.length >= 1){
    var snippetsObject = snippetsArray[0] // merge the snippets array
    for (var i = 1; i < snippetsArray.length; i++) {
      snippetsObject = $.extend(true, {}, snippetsObject, snippetsArray[i]);
    }
    console.log(JSON.stringify(snippetsObject))
    var snippetsJSONPath = path.join(__dirname + '/../snippets/snippets.json')
    try {
      var snippetsJSON = JSON.parse(fs.readFileSync(snippetsJSONPath, 'utf8'));
    } catch (e) {
      console.log("Something went wrong when reading ember-addon-snippets snippets file")
    }
    fs.writeFileSync(snippetsJSONPath, JSON.stringify(snippetsObject, null, 3))
  }
};
exports.refreshSnippets = refreshSnippets;
