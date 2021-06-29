<h1 align="center">
  <br>
  <a href="https://www.energyweb.org/"><img src="https://www.energyweb.org/wp-content/uploads/2019/04/logo-brand.png" alt="EnergyWeb" width="150"></a>
  <br>
  EnergyWeb Origin
  <br>
  <h2 align="center">Integration Tutorial</h2>
  <br>
  <br>
</h1>

Welcome to the Origin SDK integration tutorial. We will guide you on how to 🚀launch your API and UI services using Origin SDK

Origin SDK repository https://github.com/energywebfoundation/origin

## Requirements

This tutorial requires basic understanding of programming in JavaScript, including setuping environments (both backend and frontend).

Each component can be setup using boilerplates or libraries quick-start guides, but some configuration tweaking will be necessary.

## What's next

This repository is split into `origin-api` and `ui` directories.
They can be found in [packages directory](./packages).

Both API and UI have to be properly configured, so please check README files inside those directories. There are detailed explanations.

If you don't want to setup these packages by yourself, You can copy this repository, and start backend and frontend using `yarn start` inside respective directories. Remember to create, migrate and seed database beforehand (see [API README](./packages/origin-api/README.md)).