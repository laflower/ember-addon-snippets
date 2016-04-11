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
    utils.watchNodeModules(atom.project.getPaths())
    return utils.refreshSnippets(atom.project.getPaths());
  },
  deactivate: function() {
    return this.subscriptions.dispose();
  },
  refresh: function() {
    return utils.refreshSnippets();
  }
};
