var vscode = require('vscode');
var utils = require('./refresh-snippets');

function activate(context) {

    utils.watchNodeModules(vscode.workspace.rootPath)
    utils.refreshSnippets(vscode.workspace.rootPath)
    
    var disposable = vscode.commands.registerCommand('extension.refreshSnippets', function () {
        utils.refreshSnippets(vscode.workspace.rootPath)
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;