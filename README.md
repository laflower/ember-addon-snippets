# ember-addon-snippets

Ember addon snippets for [Atom](http://atom.io/).

### Adding Snippets to your ember addons

1. Create a `snippets` folder at the root of your ember project.
2. Create a `snippets.json` file inside the `snippets` folder.
3. Fill `snippets.json` with snippets. Your file should have the following format.

```json
{
  ".source.hbs": {
    "ember-frost-button": {
      "prefix": "frost-button",
      "body": "{{frost-button}} $1"
    },
    ...
  },
  ".source.js": {
    "Console log": {
      "prefix": "log",
      "body": "console.log $1"
    },
    ...
  },
  ...
}
```
