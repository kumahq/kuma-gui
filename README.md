<a href="https://kuma.io/"><img class="logo" src="https://kuma-public-assets.s3.amazonaws.com/kuma-logo-v2.png"></a>

<a class="badge" href="https://github.com/kumahq/kuma-gui/actions"><img alt="Tests passing" src="https://github.com/kumahq/kuma-gui/workflows/main/badge.svg"></a>
<a class="badge" href="https://github.com/kumahq/kuma/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-Apache%202.0-blue.svg"></a>
<a class="badge" href="https://join.slack.com/t/kuma-mesh/shared_invite/zt-1rcll3y6t-DkV_CAItZUoy0IvCwQ~jlQ"><img alt="Slack" src="https://img.shields.io/badge/Slack-4A154B?logo=slack"></a>
<a class="badge" href="https://twitter.com/intent/follow?screen_name=KumaMesh"><img alt="Twitter" src="https://img.shields.io/twitter/follow/KumaMesh.svg?style=social&label=Follow"></a>

# Kuma GUI

This is the source code for the [Kuma](https://github.com/kumahq/kuma/) GUI. It's proudly built on [Vue.js](https://vuejs.org/) and leverages the [Kongponents](https://kongponents.konghq.com/) component library.

When running Kuma itself, the GUI is automatically served on port `:5681` and is accessible in your browser at `http://localhost:5681/gui`. If you would like to run the GUI isolated and in development mode, this repository allows you to do so. This allows you to inspect the Vue.js components with tools like [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/), which is available for both Firefox and Google Chrome.

The [Kuma GUI documentation](https://kuma.io/docs/latest/documentation/gui/) provides you with a walkthrough of what the GUI offers.

## What is Kuma?

Kuma is a platform agnostic open-source control plane for Service Mesh and Microservices. It can run and be operated natively across both Kubernetes and VM environments, making it easy to adopt by every team in the organization.

Bundling Envoy as a data-plane, Kuma can instrument any L4/L7 traffic to secure, observe, route and enhance connectivity between any service or database. It can be used natively in Kubernetes via CRDs or via a RESTful API across other environments like VMs and Bare Metal.

While being simple to use for most use-cases, Kuma also provides policies to configure the underlying Envoy data-planes in a more fine-grained manner. By doing so, Kuma can be used by both first-time users of Service Mesh, as well as the most experienced ones.

Built by Envoy contributors at Kong 🦍.

**Need help?** Installing and using Kuma should be as easy as possible. Contact and chat with the community in real-time if you get stuck or need clarifications. We are here to help.

[Installation](https://kuma.io/install) |
[Documentation](https://kuma.io/docs) |
[Slack Chat](https://join.slack.com/t/kuma-mesh/shared_invite/zt-1rcll3y6t-DkV_CAItZUoy0IvCwQ~jlQ) |
[Community](https://kuma.io/community) |
[Blog](https://konghq.com/blog) |
[Kong](https://konghq.com)

## Development

Kuma is under active development and production-ready.

See [DEVELOPER.md](DEVELOPER.md) for further details.

## License

```
Copyright 2020 the Kuma Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

[kuma-url]: https://kuma.io/
[kuma-logo]: https://kuma-public-assets.s3.amazonaws.com/kuma-logo-v2.png
