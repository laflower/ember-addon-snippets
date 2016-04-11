# ember-addon-snippets

Ember addon snippets for [Atom](http://atom.io/) and [VS Code](http://code.visualstudio.com/).

Checkout the atom package [source](https://github.com/ciena-blueplanet/ember-addon-snippets/tree/atom)
Checkout the vsc extension [source](https://github.com/ciena-blueplanet/ember-addon-snippets/tree/vsc)

```.

### Adding Snippets to your ember addons

Simply add them to your project's `package.json` using the following format which is compatible with both [Atom](http://atom.io/) And [VS Code](http://code.visualstudio.com/).

```json
"atomSnippets": {
  ".source.hbs": {
    "ember-frost-button": {
      "prefix": "frost-button",
      "body": "{{frost-button}} $1"
    }
  },
  ".source.js": {
    "Console log": {
      "prefix": "log",
      "body": "console.log $1"
    }
  }
}
```
