var CompositeDisposable, EmberAddonSnippets, utils;
CompositeDisposable = require('atom').CompositeDisposable;
utils = require('./refresh-snippets');

module.exports = EmberAddonSnippets = {
  subscriptions: null,
  projectDirectory: null,
  activate: function(state) {
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ember-addon-snippets:refresh': (function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this)
    }));
    console.log('ember-addon-snippets is about to be refreshed!');
    return utils.watchNodeModules(atom.project.getPaths());
  },
  deactivate: function() {
    return this.subscriptions.dispose();
  },
  refresh: function() {
    console.log('ember-addon-snippets is about to be refreshed!');
    return utils.refreshSnippets(atom.project.getPaths());
  }
};
