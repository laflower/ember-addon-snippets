var fs = require('fs');
var path = require('path')
var extend = require('node.extend');
var chokidar = require('chokidar');

module.exports = refreshSnippets = {
    projectRoot: "",
    refreshScheduled: false,
    scheduleRefresh: function() {
        if (!this.refreshScheduled) {
            this.refreshScheduled = true
            setTimeout(function() {
                this.refreshScheduled = false
                setTimeout(function() {
                    if (!this.refreshScheduled) {
                        refreshSnippets.refreshSnippets()
                    }
                }, 20000)
            }, 10000)
        }
    },
    watchNodeModules: function(projectRoot) {
        this.projectRoot = projectRoot
        console.log("watching node modules at: " + this.projectRoot)
        var watchers = []
        watcher = chokidar.watch(this.projectRoot, {
            usePolling: true,
            interval: 15000,
            ignored: function(path) {
                if(refreshSnippets.projectRoot.indexOf(path) !== -1){
                    return false
                }
                else if (path == refreshSnippets.projectRoot + "/node_modules") {
                    return false
                }
                else if(path.indexOf(refreshSnippets.projectRoot + "/node_modules/ember-") !== -1){
                    if(path.match(/\//g).length == refreshSnippets.projectRoot.match(/\//g).length + 2){
                        return false
                    }
                    else if(path.indexOf('/snippets') !== -1){
                        if(path.endsWith('/snippets'))
                            return false
                        else if(path.endsWith('/snippets/snippets.json'))
                            return false
                    }
                }
                return true
            },
            ignoreInitial: true,
            depth: 3
        });
        watcher
            .on('add', function(path) {
                console.log(path, 'has been added')
                refreshSnippets.scheduleRefresh()
            })
            .on('change', function(path) {
                console.log(path, 'has been changed')
                refreshSnippets.scheduleRefresh()
            })
    },
    refreshSnippets: function(projectRoot) {
        if(projectRoot != undefined)
            this.projectRoot = projectRoot
        console.log("refreshing snippets " + this.projectRoot)
        var snippetsArray = []
        try {
            var node_modules = fs.readdirSync(this.projectRoot + '/node_modules')
        } catch (e) {
            console.log(this.projectRoot + " does not have node_modules")
            return
        }
        for (var i = 0; i < node_modules.length; i++) {
            if (!(node_modules[i].startsWith("ember-")))
                continue
            try {
                var snippets = JSON.parse(fs.readFileSync(this.projectRoot +
                    '/node_modules/' +
                    node_modules[i] +
                    "/snippets/" +
                   "snippets.json"))
            } catch (e) {
                console.log("Something went wrong when opening and json parsing " + node_modules[i])
                continue;
            }

            if (snippets == undefined) {
                continue;
            } else {
                snippetsArray.push(snippets)
            }
        }
        if (snippetsArray.length >= 1) { 
            var snippetsObject = snippetsArray[0] // merge the snippets array
            for (var i = 1; i < snippetsArray.length; i++) {
                snippetsObject = extend(true, {}, snippetsObject, snippetsArray[i]);
            }
            console.log(JSON.stringify(snippetsObject))
            var snippetsJSONPath = path.join(__dirname + '/snippets/snippets.json')
            try {
                var snippetsJSON = JSON.parse(fs.readFileSync(snippetsJSONPath, 'utf8'));
            } catch (e) {
                console.log("Something went wrong when reading ember-addon-snippets snippets file")
            }
            fs.writeFileSync(snippetsJSONPath, JSON.stringify(snippetsObject, null, 3))
        }
    }
};
