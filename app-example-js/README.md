# Application example for `redux-saga-controller`

[CodeSandbox Demo](https://codesandbox.io/s/app-example-js-egbtz)


## Link for local environments

### Linking `redux-saga-controller`
Go to the root folder of the project. Then link it locally.

```sh
cd ~path/to/project/folder/redux-saga-controller
npm link
```

### Using Linked `redux-saga-controller`
Go to the `app-example` folder of the project. Then use linked locally package of `redux-saga-controller`.

```sh
cd app-example
npm i
npm link redux-saga-controller
```

### Run app-example with locally linked `redux-saga-controller`
Go to the `app-example` folder of the project there is a minimal `create-react-app` project. Available all commands provided by `react-scripts`. 

```sh
cd app-example
npm run start
```

#### A possible problem with linking is the duplication of React under root project as peer dependency of the example project. Might be solved by removing `node_modules` for the parent project before running start for the example project.

#### To get updates from parent project and using latest local version of `redux-saga-controller` please do not forget `build` it before ¯\\_(ツ)_/¯
