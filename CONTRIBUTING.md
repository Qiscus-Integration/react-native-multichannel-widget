# Contributing

Contributions are always welcome, no matter how large or small.

Before contributing, read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Development Workflow

This project is a monorepo managed with Yarn workspaces:

- Library package in repository root
- Example app in `example/`

Use Yarn 3.6.1 (declared in `package.json`) via Corepack.

### Prerequisites

- Node.js installed
- Corepack enabled (`corepack enable`)
- Android Studio / Xcode if you run native targets

### Setup

Run from repository root:

```sh
corepack yarn install
```

## Quick Start (Example App)

Run from repository root.

1. Start Metro in terminal 1:

```sh
corepack yarn example:metro
```

2. Run app in terminal 2:

```sh
# Android
corepack yarn example:android

# iOS
corepack yarn example:ios

# Web
corepack yarn example:web
```

Optional Android device picker:

```sh
corepack yarn example:android -- --device
```

### Troubleshooting

- `sh: expo: command not found`: run `corepack yarn install` first, then run commands from repository root.
- `No version is set for command yarn`: use `corepack yarn ...`.
- Native code change not reflected: rebuild app with `corepack yarn example:android` or `corepack yarn example:ios`.

## Local Library Development

The example app is linked to the local library workspace:

- JavaScript/TypeScript changes are reflected without rebuilding native app
- Native module changes require rebuilding the app target

## Architecture Notes

### Built-In File Attachment Picker

The library uses `@react-native-documents/picker` directly in `src/` for both:
- image attachment picker
- document/file attachment picker

`MultichannelWidget` no longer accepts `pickImage` / `pickDocument` props from consumers.

**Rules when contributing:**
- Keep `@react-native-documents/picker` in `peerDependencies` with a clear compatibility range.
- Keep image picker limited to image mime type only.
- Keep document picker limited to non-image document/file mime types.
- Keep behavior consistent with README usage (consumer only passes `onBack` to `MultichannelWidget`).

## Validation Commands

Run before opening a PR:

```sh
corepack yarn typecheck
corepack yarn lint
corepack yarn test
```

When you need to regenerate build output (`lib/`):

```sh
corepack yarn prepare
```

## Publishing

This project uses `release-it` for publishing:

```sh
corepack yarn release
```

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/en):

- `fix`: bug fixes
- `feat`: new features
- `refactor`: internal refactor
- `docs`: documentation changes
- `test`: test changes
- `chore`: tooling/config changes

## Pull Request Checklist

- Keep PRs focused and small
- Run typecheck/lint/tests locally
- Add or update tests when possible
- Update docs for behavior/API changes
