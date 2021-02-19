# Open in git web provider

This extension allows you to open the currently open file in the web interface of any git web provider (such as GitHub/BitBucket/GitLab, etc...). It was born out of the frustration of none of the existing solutions working with our custom bitbucket setup, so it provides a very powerful way to provide a custom url template based on a [mustache](https://mustache.github.io/mustache.5.html) template.

## Features

Specify a custom URL-mustache-template that formats `filePath`, `revision` and `lines` into a viewable URL for your custom git web provider.

For example, configuring `open-in-git-web-provider.urlTemplate` like this:

```
https://my.custom.bitbucket.host.com/projects/MyProject/repos/myrepo/browse/{{{filePath}}}?at={{#urlencoded}}{{{revision}}}{{/urlencoded}}#{{{lines}}}
```

will render URLs like:

```
https://my.custom.bitbucket.host.com/projects/MyProject/repos/myrepo/browse/package.json?at=feature/PUM-27-serve-privacy-policy-from-sps#9-12
```

## Requirements

- `git` should be available on your `$PATH`
  If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

- `open-in-git-web-provider.urlTemplate`: You have to configure this for every project/repo, so I recommend you configure it in your workspace settings.

Calling out known issues can help limit users opening duplicate issues against your extension.

### Configuring the url template

The `urlTemplate` setting is a mustache-template that will be rendered with the following properties:

- `filePath`: Relative file-path of the currently open file in the repository
- `revision`: The revision that the repo is currently on (typically the branch name, but could be a commit hash if HEAD is detached)
- `lines`: An array of strings that represent the selected line numbers. Empty if there is no active selection. Ranges are represented as `x-y`. Possible example values are thus `["1"]`, `[]`, `["33", "57", "494"]`, `["7-10"]` or `["3", "7-10", "15-22"]`

Since mustache HTML-encodes all interpolations by default, be sure to use the triple-curly-brackets (e.g. `{{{filePath}}}`) to disable this behaviour.

All of these values are passed as-is, without any url-encoding. If you need to url-encode something, you can use `{#urlencoded}<this will be encoded>{/urlencoded}`. For example to url encode the revision, you could use

```
https://my-bitbucket.com/project/foobar/{{{filePath}}}?at={{#urlencoded}}{{{revision}}}{{/urlencoded}}
```

## Release notes

### 1.0.0

Initial release.
