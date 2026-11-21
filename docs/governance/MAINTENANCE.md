# Maintaining the factory

## Before every change is merged

Run all three and fix what fails:

```
npm test
node scripts/validate-factory.mjs
node scripts/doctor.mjs
claude plugin validate .
```

## Routine

| When | Do |
|---|---|
| Changing an agent or skill | Keep one purpose per file. Update `standards/upstream-routing.md` if an owner changes. Keep skills under 120 lines. Bump the version in `plugin.json`, `marketplace.json`, `manifest.json` and `package.json` together. |
| Monthly, or after a Claude Code update | Run the doctor. Reread `hooks/hooks.json` against the current hook documentation. Update `claudeCode.testedVersion`. |
| Quarterly | Review each upstream per `docs/integrations/UPDATE_GUIDE.md`. Remove components nobody used. Review permissions: agents list tools explicitly and none has more than it needs. |
| After each project | Collect feedback and candidate lessons (`LESSONS.md`). Turn real friction into an issue or a change here. |

## Versioning

Semantic versions. A change that alters a task format, a gate or a required project file is a minor version at least, with a migration note in `CHANGELOG.md`.

## What validation covers

`validate-factory.mjs` checks files, formats, references, links, obvious secrets, the manifest and the sample project. It does not run skills or agents. Behaviour is checked by using the workflows on the sample project and recording the result in `docs/VALIDATION_REPORT.md`.
