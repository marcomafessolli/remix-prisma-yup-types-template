> Built with [Remix.run](https:/remix.run)

# Remix + Prisma + Yup + Loader/Action Request/Response Helpers and Types

Structure:

```
... remix generated code
./prisma/
./utils/
./app/models
/./app/utils/
```

## `./prisma/`

Folder where prisma schema and migrations are stored

## `./utils/`

Folder where scripts are stored. Currently, there's one script that generates model types file to be used later by Typescript

### `./utils/generate-type-models-file.ts`

Script that reads `./app/models/` directories and generates a `APP_MODELS` type

## `./app/models/`

Folder where models and validations are built. When running `npm run dev`, this template generates a file called `models.ts` which is built by reading the directories within `./app/models/` to be imported by `./app/utils/` and provide Typescript code suggestions.

### `./app/models/index.ts`

File that exports prisma middlewares defined by each model (can be automated). This is used by `./utils/db.server.ts` which imports `middlaewareHooks` and adds it to Prisma middleware.

### `./app/models/validation.ts`

Functions that validates/format request input data based on models schema (`yup.validate`). It also resolves errors to a object that has Typescript autocomplete based on Generics.

### `./app/models/user/index.ts`

Files that exports `user.prisma.ts` types and middleware

### `./app/models/user/user.prisma.ts`

File that declares yup schema, prisma middleware and User types.

## `./app/utils/`

Folder that contains types and helpers for the remix application.

### `./app/utils/db.server.ts`

A copy of `db.server.ts` from `remix/jokes`

### `./app/utils/action.handler.ts`

File that provides types and functions to add typescript support based on generics (inspired on express)

### `./app/utils/loader.handler.ts`

File that provides types and functions to add typescript support based on generics (inspired on express)
