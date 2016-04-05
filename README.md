# ember-addon-snippets

Ember addon snippets for [Atom](http://atom.io/).

### Adding Snippets to your ember addons

Simply add them to your project's `package.json` using the following format.

```json
"atomSnippets": {
  ".source.hbs": {
    "Console log": {
      "prefix": "justin",
      "body": "laflower.log $1"
    }
  },
  ".source.js": {
    "Consle log": {
      "prefix": "eric",
      "body": "ewhite.log $1"
    }
  }
}
```
