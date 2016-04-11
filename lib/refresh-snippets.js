var fs = require('fs');
var path = require('path')
var $ = require('jQuery');
var chokidar = require('chokidar');

module.exports = refreshSnippets = {
  projectsInWorkspace: [],
  refreshScheduled: false,
  scheduleRefresh: function () {
    if(!this.refreshScheduled){
      this.refreshScheduled = true
      setTimeout(function () {
        this.refreshScheduled = false
        setTimeout(function () {
          if(!this.refreshScheduled){
            refreshSnippets.refreshSnippets()
          }
        }, 20000)
      }, 10000)
    }
  },
  watchNodeModules: function (projectsInWorkspace) {
    this.projectsInWorkspace = projectsInWorkspace
    var watchers = []
    for (var i = 0; i < this.projectsInWorkspace.length; i++) {
      try {
            var node_modules = fs.readdirSync(this.projectsInWorkspace[i] + '/node_modules')
        } catch (e) {
            console.log(this.projectsInWorkspace[i] + " does not have node_modules")
            continue
        }
      watchers[i] = chokidar.watch(this.projectsInWorkspace[i] + "/node_modules/", {
        usePolling: true,
        interval: 15000,
        ignored: function(path) {
                // ignores everything but package.json and
                // its containing ember directory
                return path.search(/node_modules\/ember-.+\/package.json$/) === -1 &&
                    !(path.indexOf('.') === -1 &&
                        path.search(/node_modules\/.+\/.+/) === -1)
        },
        ignoreInitial: true,
        depth: 2
      });
      watchers[i]
        .on('add', function(path) {
          console.log(path, 'has been added')
          refreshSnippets.scheduleRefresh()
        })
        .on('change', function(path) {
          console.log(path, 'has been changed')
          refreshSnippets.scheduleRefresh()
        })
    }
  },
  refreshSnippets: function (projectsInWorkspace) {
    if(projectsInWorkspace != undefined)
      this.projectsInWorkspace = projectsInWorkspace

    var snippetsArray = []
    for (var i = 0; i < this.projectsInWorkspace.length; i++) {
      try {
        var node_modules = fs.readdirSync(this.projectsInWorkspace[i] + '/node_modules')
      } catch (e) {
        console.log(this.projectsInWorkspace[i] + " does not have node_modules")
        continue
      }
      for (var j = 0; j < node_modules.length; j++) {
        if(!(node_modules[j].startsWith("ember-")))
          continue
        try {
          var module_package_json = JSON.parse(fs.readFileSync(this.projectsInWorkspace[i] +
                                                                '/node_modules/' +
                                                                node_modules[j] +
                                                                "/package.json"))
        } catch (e) {
          console.log("Something went wrong when opening " + node_modules[j])
          continue;
        }

        var snippets = module_package_json.snippets
        if(snippets == undefined){
          continue;
        }else{
          snippetsArray.push(snippets)
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
