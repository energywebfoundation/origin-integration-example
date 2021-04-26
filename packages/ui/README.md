# EnergyWeb Origin UI example implementation

In this example we will setup Origin frontend, using provided components.

Frontend uses typical React stack: `react` itself, `react-router-dom` (`connected-react-router`), `redux` (`react-redux`) and `redux-saga`.
Translations are based on `i18next` (`react-i18next`). All of these libraries will be necessary to run @energyweb components.

For bundling everything together we will use Webpack. There are some non-typical configuration tweaks.

The language of choice is TypeScript, but plain JavaScript works just as well.
The package manager of choice is `yarn`, but `npm` works the same.

Complete example can be found in the source code, so make sure to compare this tutorial with what's actually in the source code.
This README covers crucial requirements of the setup.

**If you want, you may just copy the code, and build on top of it. Then You can use README to explain "the why"**

## Big picture

Almost every component, that is necessary to build UI is inside `@energyweb/origin-ui-core`.

Components inside require you to setup some global dependencies like router, state manager, translations and so on.
They will require almost the exact setup, that will be presented here.

## Installing dependencies

Please use our [package.json](./package.json) to setup dependencies. This way you use correct set of modules.

## Prepare Webpack configuration

Start with Webpack configuration from https://webpack.js.org/guides/getting-started/

@TODO are those loaders required?

Add common loaders:
- `css-loader`, `style-loader - for CSS
- `ts-loader` - for TypeScript
- `url-loader` - for PNG, JPG, GIF

After setuping typical Webpack configuration, some tweaks need to be applied.

### Node dependencies fallbacks

The first thing is to resolve fallbacks. This is necessary, since some components rely on node dependencies.
For Webpack v4 those polyfills are included automatically, but for newer Webpack v5 they are not.

So make sure to add following options to webpack configuration:

```js
resolve: {
    ...
    fallback: {
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        os: require.resolve('os-browserify/browser'),
        crypto: require.resolve('crypto-browserify'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('zlib-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        vm: require.resolve('vm-browserify'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
        fs: false
    },
    ...
},
```

### Library aliases

Because some of React libraries are designed to be applied globally, you need to ensure, that all of them and your own code use the exact same version. This can be achieved by adding following to Webpack configuration:

```js
resolve: {
    ...
    alias: {
        'react-redux': require.resolve('react-redux'),
        'react-i18next': require.resolve('react-i18next')
    },
},
```

### Additional loaders

Besides typical frontend development webpack `@svgr/webpack` and `url-loader` loaders are required for svg images:

```js
module: {
  rules: [
    ...
    {
      test: /\.svg$/,
      use: [
        '@svgr/webpack',
        {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      ],
    },
    ...
  ]
}
```

### Externals

Please add the following, since some dependencies may require `xmlhttprequest` library.

```
...
externals: [
  {
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }
]
...
```

### Environment configuration loading

Origin SDK configuration loader will request the file at `/env-config.json` to retrieve application configuration, therefore it needs to be present in root directory of the frontend application. For local development `CopyWebpackPlugin` may be used. For production you want to overwrite `env-config.json` file, that you serve from the server.

```js
plugins: [
  new CopyWebpackPlugin({
    patterns: [{ from: 'env-config.json', to: 'env-config.json' }]
  }),
]
```

Create `env-config.json` file in root directory:

```json
{
    "MODE": "dev",
    "WEB3": "http://localhost:8545",
    "BACKEND_URL": "http://localhost",
    "BACKEND_PORT": "3030",
    "BLOCKCHAIN_EXPLORER_URL": "",
    "REGISTRATION_MESSAGE_TO_SIGN": "I register as an Origin user",
    "ISSUER_ID": "Issuer ID"
}
```

## Prepare React environment

Minimal setup includes:

1. `react-redux` (we use `redux-toolkit` in this tutorial, so you may refer this instead)
2. `connected-react-router`
3. `react-saga`
4. `react-i18next`

You can setup everything using appropriate libraries startup guides.

Quickstart setup can be found in [initialization directory](./src/initialization/index.ts) and [entrypoint](./src/index.tsx). Note, that it does import Origin-specific files.

## Add Origin configuration

Origin global configuration expects to use a `<OriginConfigurationProvider />` (as in [entrypoint](./src/index.tsx)) - imported from `@energyweb/origin-ui-core`.

The configuration itself can be configured as in [config file](./src/origin/config.ts) - variables are described there. Also it imports `theme.ts` file, which is `material-ui` theme schema.

We expect to find certain sagas and reducers. You can find those in [sagas.ts file](./src/origin/sagas.ts), and [reducers.ts file](./src/origin/reducers.ts). Please use them in your application (as in [store.ts file](./src/initialization/store.ts)). Also, sagas need to be started: it happens in initialization file](./src/initialization/index.ts).

## Add Origin components

`@energyweb/origin-ui-core` exports `UiCoreAdapter`. This component allows to connect Origin component with your application.

Example usage can be found in [Application component](./src/components/App.tsx):

```tsx
<UiCoreAdapter
  store={store}
  configuration={originConfig}
  history={history}
  component={<LoginPage />}
/>
```

It expects history object (shared with all other parts of application), configuration (as in [Add Origin configuration](#add-origin-configuration) section), and store reducer.

Application works best if you use pre-defined URLs for router. Those can be imported from `useLinks` function, that is exported from `@energyweb/origin-ui-core`.