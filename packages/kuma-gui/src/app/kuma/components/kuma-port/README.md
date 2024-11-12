# KumaPort

Reusable component for displaying ports.

You can mostly just pass an entire object from the API for this to "do the
right thing".

If you specifically want to **not** show a certain property such as
`targetPort` use a spread syntax and overwrite the thing you don't want to show
with `undefined` (see first example below).

If the `port` is the same as the `name`, then the `(name)` will not show.

<Story height="320">
  <div>
    <KumaPort
      :port="{
        ...{
          name: 'nginx',
          port: 80,
          targetPort: 8080,
          appProtocol: 'http',
          protocol: 'tcp',
        },
        targetPort: undefined
      }"
    />
  </div>
  <div>
    <KumaPort
      :port="{
        ...{
          name: '80',
          port: 80,
          targetPort: 8080,
          appProtocol: 'http',
          protocol: 'tcp',
        },
      }"
    />
  </div>
  <div>
    <KumaPort
      :port="{
        name: 'nginx',
        port: 80,
        targetPort: 8080,
        appProtocol: 'http',
        protocol: 'tcp',
      }"
    />
  </div>
  <div>
    <KumaPort
      :port="{
        port: 80
      }"
    />
  </div>
  <div>
    <KumaPort
      :port="{
        port: 80,
        targetPort: 8080
      }"
    />
  </div>
  <div>
    <KumaPort
      :port="{
        port: 80,
        targetPort: 8080,
        protocol: 'tcp'
      }"
    />
  </div>
  <div>
    <KumaPort
      :port="{
        port: 80,
        targetPort: 8080,
        appProtocol: 'http',
        protocol: 'tcp',
      }"
    />
  </div>
</Story>


