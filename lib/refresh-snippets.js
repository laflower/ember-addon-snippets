var fs = require('fs');
var path = require('path')

function refreshSnippets(projectsInWorkspace) {
  var snippets = {}
  for (var i = 0; i < projectsInWorkspace.length; i++) {
    console.log(projectsInWorkspace[i])
    try {
      var node_modules = fs.readdirSync(projectsInWorkspace[i] + '/node_modules')
    } catch (e) {
      console.log(projectsInWorkspace[i] + " does not have node_modules")
      continue
    }
    console.log('found node_modules for ' + projectsInWorkspace[i])
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
    }
  }
  var snippetsJSONPath = path.join(__dirname + '/../snippets/snippets.json')
  try {
    var snippetsJSON = JSON.parse(fs.readFileSync(snippetsJSONPath, 'utf8'));
  } catch (e) {
    console.log("Something went wrong when reading ember-addon-snippets snippets file")
  }
  fs.writeFileSync(snippetsJSONPath, JSON.stringify(snippetsJSON))
};
exports.refreshSnippets = refreshSnippets;
