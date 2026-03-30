<a href="https://kuma.io/"><img class="logo" src="https://kuma-public-assets.s3.amazonaws.com/kuma-logo-v2.png"></a>

[![master](https://github.com/kumahq/kuma-gui/actions/workflows/main.yml/badge.svg)](https://github.com/kumahq/kuma-gui/actions/workflows/main.yml)
[![Releases to: kumahq/kuma](https://github.com/kumahq/kuma-gui/actions/workflows/release.yml/badge.svg)](https://github.com/kumahq/kuma-gui/actions/workflows/release.yml)
<a class="badge" href="https://github.com/kumahq/kuma-gui/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-Apache%202.0-blue.svg"></a>
<a class="badge" href="https://join.slack.com/t/kuma-mesh/shared_invite/zt-1rcll3y6t-DkV_CAItZUoy0IvCwQ~jlQ"><img alt="Slack" src="https://img.shields.io/badge/Slack-4A154B?logo=slack"></a>

# Kuma GUI

This is the source code for the [Kuma](https://github.com/kumahq/kuma/) GUI.
It's proudly built on [Vue.js](https://vuejs.org/) and leverages the
[Kongponents](https://kongponents.konghq.com/) component library.

Changes are continuously "released" and [embedded in the Kuma
software/binary](https://github.com/kumahq/kuma/tree/master/app/kuma-ui/pkg/resources)

When running Kuma itself, the GUI is automatically served on port `:5681` and
is accessible in your browser at `http://localhost:5681/gui`.

The [Kuma GUI documentation](https://kuma.io/docs/latest/production/gui/)
provides you with a walkthrough of what the GUI offers.

## What is Kuma?

Kuma is a modern Envoy-based service mesh that can run on every cloud, in a
single or multi-zone capacity, across both Kubernetes and VMs. Thanks to its
broad universal workload support, combined with native support for Envoy as its
data plane proxy technology (but with no Envoy expertise required), Kuma
provides modern L4-L7 service connectivity, discovery, security, observability,
routing and more across any service on any platform, databases included.

Easy to use, with built-in service mesh policies for security, traffic control,
discovery, observability and more, Kuma ships with an advanced multi-zone and
multi-mesh support that automatically enables cross-zone communication across
different clusters and clouds, and automatically propagates service mesh
policies across the infrastructure. Kuma is currently being adopted by
enterprise organizations around the world to support distributed service meshes
across the application teams, on both Kubernetes and VMs.

Originally created and donated by Kong, Kuma is today CNCF (Cloud Native
Computing Foundation) Sandbox project and therefore available with the same
openness and neutrality as every other CNCF project. Kuma has been engineered
to be both powerful yet simple to use, reducing the complexity of running a
service mesh across every organization with very unique capabilities like
multi-zone support, multi-mesh support, and a gradual and intuitive learning
curve.

**Need help?** Installing and using Kuma should be as easy as possible. Contact
and chat with the community in real-time if you get stuck or need
clarifications. We are here to help. See [Get
Involved](https://github.com/kumahq/kuma?tab=readme-ov-file#get-involved) in
the [Kuma Repository](https://github.com/kumahq/kuma) for more details.

## GUI Development

This repository is a monorepo containing the main web application along with
various custom local (but unpublished) packages used by the web application.

For contributions, the best starting point is the web application itself:
[@kumahq/kuma-gui](./packages/kuma-gui/README.md)

Additionally, an overview of all packages in the repository can be found at
[./packages/README.md](./packages/README.md)
