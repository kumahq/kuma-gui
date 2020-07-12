[![][kuma-logo]][kuma-url]

[![Twitter](https://img.shields.io/twitter/follow/thekonginc.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=thekonginc)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKong%2Fkuma-gui.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FKong%2Fkuma-gui?ref=badge_shield)

# Kuma GUI

This is the source code for the [Kuma](https://github.com/kumahq/kuma/) GUI. It's proudly built on [Vue.js](https://vuejs.org/) and leverages the [Kongponents](https://kongponents.konghq.com/) component library.

When running Kuma itself, the GUI is automatically served on port `:5683` and is accessible in your browser at `http://localhost:5683/`. If you would like to run the GUI isolated and in development mode, this repository allows you to do so. This allows you to inspect the Vue.js components with tools like [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/), which is available for both Firefox and Google Chrome.

The [Kuma GUI documentation](https://kuma.io/docs/latest/documentation/gui/) provides you with a walkthrough of what the GUI offers.

## What is Kuma?

Kuma is a platform agnostic open-source control plane for Service Mesh and Microservices. It can run and be operated natively across both Kubernetes and VM environments, making it easy to adopt by every team in the organization.

Bundling Envoy as a data-plane, Kuma can instrument any L4/L7 traffic to secure, observe, route and enhance connectivity between any service or database. It can be used natively in Kubernetes via CRDs or via a RESTful API across other environments like VMs and Bare Metal.

While being simple to use for most use-cases, Kuma also provides policies to configure the underlying Envoy data-planes in a more fine-grained manner. By doing so, Kuma can be used by both first-time users of Service Mesh, as well as the most experienced ones.

Built by Envoy contributors at Kong 🦍.

**Need help?** Installing and using Kuma should be as easy as possible. Contact and chat with the community in real-time if you get stuck or need clarifications. We are here to help.

[Installation](https://kuma.io/install) |
[Documentation](https://kuma.io/docs) |
[Slack Chat](https://chat.kuma.io) |
[Community](https://kuma.io/community) |
[Blog](https://konghq.com/blog) |
[Kong](https://konghq.com)

## Getting up and running

### Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### Run your end-to-end tests
```
yarn run test:e2e
```

### Run your unit tests
```
yarn run test:unit
```

[kuma-url]: https://kuma.io/
[kuma-logo]: https://kuma-public-assets.s3.amazonaws.com/kuma-logo-v2.png


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKong%2Fkuma-gui.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FKong%2Fkuma-gui?ref=badge_large)
