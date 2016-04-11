# ember-addon-snippets

Ember addon snippets for [VS Code](http://code.visualstudio.com/).

### Adding Snippets to your ember addons

Simply add them to your project's `package.json` using the following format.

```json
"snippets": {
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
