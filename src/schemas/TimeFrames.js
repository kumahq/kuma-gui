module.exports = {
  options: [{
    text: 'Last 5 Minutes',
    value: {
      text: 'Last 5 Minutes',
      timeFrameLength: 300,
      stepSize: 1,
      param: 'seconds',
      ticksMod: 60,
      refreshInterval: 10000
    }
  }, {
    text: 'Last 30 Minutes',
    value: {
      text: 'Last 30 Minutes',
      timeFrameLength: 1800,
      stepSize: 60,
      param: 'minutes',
      ticksMod: 300,
      refreshInterval: 30000
    }
  }, {
    text: 'Last 60 Minutes',
    value: {
      text: 'Last 60 Minutes',
      timeFrameLength: 3600,
      stepSize: 60,
      param: 'minutes',
      ticksMod: 900,
      refreshInterval: 60000
    }
  }, {
    text: 'Last 6 Hours',
    value: {
      text: 'Last 6 Hours',
      timeFrameLength: 21600,
      stepSize: 60,
      param: 'minutes',
      ticksMod: 3600,
      refreshInterval: 360000
    }
  }, {
    text: 'Last 12 Hours',
    value: {
      text: 'Last 12 Hours',
      timeFrameLength: 43200,
      stepSize: 60,
      param: 'minutes',
      ticksMod: 7200,
      refreshInterval: 720000
    }
  }]
}
