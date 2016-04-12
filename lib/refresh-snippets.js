var fs = require('fs');
var path = require('path')
var extend = require('node.extend');
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
      watchers[i] = chokidar.watch(this.projectsInWorkspace[i], {
        usePolling: true,
        interval: 15000,
        ignored: function(path) {
          for(var i = 0; i < refreshSnippets.projectsInWorkspace.length; i++){
            if(refreshSnippets.projectsInWorkspace[i].indexOf(path) !== -1){
              return false
            }
            else if (path == refreshSnippets.projectsInWorkspace[i] + "/node_modules") {
              return false
            }
            else if(path.indexOf(refreshSnippets.projectsInWorkspace[i] + "/node_modules/ember-") !== -1){
              if(path.match(/\//g).length == refreshSnippets.projectsInWorkspace[i].match(/\//g).length + 2){
                return false
              }
              else if(path.indexOf('/snippets') !== -1){
                if(path.endsWith('/snippets'))
                  return false
                else if(path.endsWith('/snippets/snippets.json'))
                  return false
              }
            }
          }
          return true
        },
        ignoreInitial: true,
        depth: 3
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
          var snippets = JSON.parse(fs.readFileSync(this.projectsInWorkspace[i] +
                                                                '/node_modules/' +
                                                                node_modules[j] +
                                                                "/snippets/" +
                                                                "snippets.json"))
        } catch (e) {
          console.log("Something went wrong when opening and parsing snippets for " + node_modules[j])
          continue;
        }

        if(snippets == undefined){
          continue;
        }else{
          snippetsArray.push(snippets)
        }
      }
    }
    if(snippetsArray.length >= 1){
      var snippetsObject = snippetsArray[0] // merge the snippets array
      for (var i = 1; i < snippetsArray.length; i++) {
        snippetsObject = extend(true, {}, snippetsObject, snippetsArray[i]);
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
