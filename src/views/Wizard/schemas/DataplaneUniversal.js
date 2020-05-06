module.exports = {
  type: 'Dataplane',
  mesh: null,
  name: null,
  networking: {
    address: null,
    inbound: [
      {
        port: 10000,
        servicePort: 9000,
        tags: {
          service: 'echo'
        }
      }
    ]
  }
}
