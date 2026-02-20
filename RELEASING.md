# Releasing to the Visual Studio Marketplace

## Version numbering

This project follows [semantic versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`):

| Increment | When to use | Example |
|-----------|-------------|---------|
| `patch` | Bug fix, dependency update, no behaviour change | `0.1.0 → 0.1.1` |
| `minor` | New backward-compatible feature or task input | `0.1.1 → 0.2.0` |
| `major` | Breaking change to task inputs or outputs | `0.2.0 → 1.0.0` |

`package.json` is the single source of truth for the version. The other three
version-bearing files (`azure-devops-extension.json`,
`PublishHtmlReport/task.json`, `PublishHtmlReport/package.json`) are kept in
sync automatically.

## Release workflow

### 1. Bump the version

Run one of the following from the repository root:

```bash
npm version patch   # bug fix
npm version minor   # new feature
npm version major   # breaking change
```

This single command:
- Updates `package.json` with the new version
- Runs `scripts/sync-version.js` to propagate the version to the other three files
- Stages all four changed files
- Creates a git commit (e.g. `v0.1.1`)
- Creates a git tag (e.g. `v0.1.1`)

### 2. Push the commit and tag

```bash
git push --follow-tags
```

### 3. CI/CD takes over

Pushing to `main` triggers the Azure Pipelines build, which:

1. Queries the current version published on the marketplace (fail-fast check)
2. Packages the extension with `updateTasksVersion: true` (belt-and-suspenders sync of `task.json`)
3. The `.vsix` artifact is published to the [Visual Studio Marketplace](https://marketplace.visualstudio.com/)

> The marketplace enforces strictly increasing versions. The pipeline will fail
> if the committed version is not higher than the currently published version.

## Manual sync (if needed)

If the version files ever get out of sync (e.g. after resolving a merge
conflict), restore consistency by running:

```bash
npm run version:sync
```

Then stage and commit the affected files manually.

## Files that carry the version

| File | Field | Format |
|------|-------|--------|
| `package.json` | `"version"` | `"0.1.0"` |
| `azure-devops-extension.json` | `"version"` | `"0.1.0"` |
| `PublishHtmlReport/task.json` | `version` object | `{ "Major": "0", "Minor": "1", "Patch": "0" }` |
| `PublishHtmlReport/package.json` | `"version"` | `"0.1.0"` |
