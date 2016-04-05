{CompositeDisposable} = require 'atom'
utils = require './refresh-snippets.js'

module.exports = EmberAddonSnippets =
  subscriptions: null
  projectDirectory: null

  activate: (state) ->
    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that refreshs this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'ember-addon-snippets:refresh': => @refresh()

  deactivate: ->
    @subscriptions.dispose()

  refresh: ->
    console.log 'ember-addon-snippets is about to be refreshed!'
    utils.refreshSnippets(atom.project.getPaths())
