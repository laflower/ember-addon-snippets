var fs = require('fs');
var path = require('path')
var $ = require('jQuery');
var chokidar = require('chokidar');

module.exports = refreshSnippets = {
  refreshScheduled: false,
  scheduleRefresh: function () {
    if(!this.refreshScheduled){
      this.refreshScheduled = true
      setTimeout(function () {
        console.log('this.refreshScheduled = false')
        this.refreshScheduled = false
      }, 10000)
      setTimeout(function () {
        console.log('waited 20 seconds. this.refreshSnippets is ' + this.refreshScheduled)
      }, 20000)
      if(!this.refreshScheduled)
        this.refreshSnippets()
    }
  },
  watchNodeModules: function (projectsInWorkspace) {
    var watchers = []
    for (var i = 0; i < projectsInWorkspace.length; i++) {
      try {
        fs.readdirSync(projectsInWorkspace[i] + '/node_modules')
      } catch (e) {
        console.log(projectsInWorkspace[i] + " does not have node_modules")
        continue
      }
      watchers[i] = chokidar.watch(projectsInWorkspace[i] + '/node_modules', {usePolling: true, interval: 5000, ignored: /^\./, ignoreInitial: true,  depth: 1});
      watchers[i]
        .on('add', function(path) {
          console.log(path, 'has been added')
          refreshSnippets.scheduleRefresh()
        })
        .on('change', function(path) {
          console.log(path, 'has been changed')
          refreshSnippets.scheduleRefresh()
        })
        .on('unlink', function(path) {
          console.log(path, 'has been removed')
          refreshSnippets.scheduleRefresh()
        })
    }
  },
  refreshSnippets: function (projectsInWorkspace) {
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
  }
};
