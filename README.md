# web-auth

# Dependencies

- nodejs
- yarn/npm/pnpm
- mkcert

> If you install mkcert for the first time, run `mkcert -install`.

## Up and running

```
yarn create:cert
yarn
yarn start
curl https://localhost:3000 # should respond with "hello world"
```

## The setup

```sh
nvm install 22 # get the latest version at the time of writing
corepack enable # to shim yarn
yarn add -D typescript tsx @tsconfig/node20 @types/node
yarn dlx @yarnpkg/sdks vscode
```

In VSCode run the command (CTRL+SHIFT+P, mac is commmand+shift+p) `Select TypeScript Version` -> `Use Workspace Version` (credit to https://stackoverflow.com/questions/68950938/typescript-compiler-cant-find-node-with-yarn-cannot-find-type-definition-file).

An https server tutorial you can follow is https://dev.to/josuebustos/https-localhost-for-node-js-1p1k.

