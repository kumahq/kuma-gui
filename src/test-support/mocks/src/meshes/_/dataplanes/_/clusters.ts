import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const { name } = req.params
  // use seed to sync the ports in stats.ts with the ports in _overview.ts
  fake.kuma.seed(name as string)
  const inboundCount = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  const ports = Array.from({ length: inboundCount }).map(() => fake.number.int({ min: 1, max: 65535 }))
  //
  const serviceCount = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 7, max: 50 })}`))

  const inbounds = ports.map(port => {
    const service = `localhost:${port}`
    return `${service}::observability_name:${service}
${service}::default_priority::max_connections::${fake.number.int({ min: 1, max: Date.now() })}
${service}::default_priority::max_pending_requests::${fake.number.int({ min: 1, max: Date.now() })}
${service}::default_priority::max_requests::${fake.number.int({ min: 1, max: Date.now() })}
${service}::default_priority::max_retries::3
${service}::high_priority::max_connections::1024
${service}::high_priority::max_pending_requests::1024
${service}::high_priority::max_requests::1024
${service}::high_priority::max_retries::3
${service}::added_via_api::true
${service}::10.244.0.2:8080::cx_active::0
${service}::10.244.0.2:8080::cx_connect_fail::0
${service}::10.244.0.2:8080::cx_total::0
${service}::10.244.0.2:8080::rq_active::0
${service}::10.244.0.2:8080::rq_error::0
${service}::10.244.0.2:8080::rq_success::0
${service}::10.244.0.2:8080::rq_timeout::0
${service}::10.244.0.2:8080::rq_total::0
${service}::10.244.0.2:8080::hostname::
${service}::10.244.0.2:8080::health_flags::healthy
${service}::10.244.0.2:8080::weight::1
${service}::10.244.0.2:8080::region::
${service}::10.244.0.2:8080::zone::
${service}::10.244.0.2:8080::sub_zone::
${service}::10.244.0.2:8080::canary::false
${service}::10.244.0.2:8080::priority::0
${service}::10.244.0.2:8080::success_rate::-1
${service}::10.244.0.2:8080::local_origin_success_rate::-1`
  })
  fake.kuma.seed(name as string)
  const outbounds = Array.from({ length: serviceCount }).map(_ => {
    const port = fake.number.int({ min: 1, max: 65535 })
    const service = `${fake.hacker.noun()}_svc_${port}`
    return `${service}::observability_name:${service}
${service}::default_priority::max_connections::${fake.number.int({ min: 1, max: Date.now() })}
${service}::default_priority::max_pending_requests::${fake.number.int({ min: 1, max: Date.now() })}
${service}::default_priority::max_requests::${fake.number.int({ min: 1, max: Date.now() })}
${service}::default_priority::max_retries::3
${service}::high_priority::max_connections::1024
${service}::high_priority::max_pending_requests::1024
${service}::high_priority::max_requests::1024
${service}::high_priority::max_retries::3
${service}::added_via_api::true
${service}::10.244.0.2:8080::cx_active::0
${service}::10.244.0.2:8080::cx_connect_fail::0
${service}::10.244.0.2:8080::cx_total::0
${service}::10.244.0.2:8080::rq_active::0
${service}::10.244.0.2:8080::rq_error::0
${service}::10.244.0.2:8080::rq_success::0
${service}::10.244.0.2:8080::rq_timeout::0
${service}::10.244.0.2:8080::rq_total::0
${service}::10.244.0.2:8080::hostname::
${service}::10.244.0.2:8080::health_flags::healthy
${service}::10.244.0.2:8080::weight::1
${service}::10.244.0.2:8080::region::
${service}::10.244.0.2:8080::zone::
${service}::10.244.0.2:8080::sub_zone::
${service}::10.244.0.2:8080::canary::false
${service}::10.244.0.2:8080::priority::0
${service}::10.244.0.2:8080::success_rate::-1
${service}::10.244.0.2:8080::local_origin_success_rate::-1`
  })
  return {
    headers: {},
    body: `${inbounds}
${outbounds}
access_log_sink::observability_name::access_log_sink
access_log_sink::default_priority::max_connections::1024
access_log_sink::default_priority::max_pending_requests::1024
access_log_sink::default_priority::max_requests::1024
access_log_sink::default_priority::max_retries::3
access_log_sink::high_priority::max_connections::1024
access_log_sink::high_priority::max_pending_requests::1024
access_log_sink::high_priority::max_requests::1024
access_log_sink::high_priority::max_retries::3
access_log_sink::added_via_api::false
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::cx_active::0
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::cx_connect_fail::0
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::cx_total::0
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::rq_active::0
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::rq_error::0
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::rq_success::0
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::rq_timeout::0
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::rq_total::0
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::hostname::
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::health_flags::healthy
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::weight::1
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::region::
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::zone::
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::sub_zone::
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::canary::false
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::priority::0
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::success_rate::-1
access_log_sink::/tmp/kuma-al-demo-app-gateway-7b7cd559f8-ckgq9.kuma-demo-default.sock::local_origin_success_rate::-1
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::observability_name::demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::outlier::success_rate_average::-1
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::outlier::success_rate_ejection_threshold::-1
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::outlier::local_origin_success_rate_average::-1
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::outlier::local_origin_success_rate_ejection_threshold::-1
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::default_priority::max_connections::1024
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::default_priority::max_pending_requests::1024
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::default_priority::max_requests::1024
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::default_priority::max_retries::3
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::high_priority::max_connections::1024
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::high_priority::max_pending_requests::1024
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::high_priority::max_requests::1024
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::high_priority::max_retries::3
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::added_via_api::true
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::cx_active::0
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::cx_connect_fail::0
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::cx_total::0
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::rq_active::0
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::rq_error::0
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::rq_success::0
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::rq_timeout::0
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::rq_total::0
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::hostname::
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::health_flags::healthy
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::weight::1
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::region::
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::zone::
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::sub_zone::
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::canary::false
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::priority::0
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::success_rate::-1
demo-app_kuma-demo_svc_5000-41c96d8c484e3ae3::10.42.0.6:5000::local_origin_success_rate::-1
kuma:envoy:admin::observability_name::kuma_envoy_admin
kuma:envoy:admin::default_priority::max_connections::1024
kuma:envoy:admin::default_priority::max_pending_requests::1024
kuma:envoy:admin::default_priority::max_requests::1024
kuma:envoy:admin::default_priority::max_retries::3
kuma:envoy:admin::high_priority::max_connections::1024
kuma:envoy:admin::high_priority::max_pending_requests::1024
kuma:envoy:admin::high_priority::max_requests::1024
kuma:envoy:admin::high_priority::max_retries::3
kuma:envoy:admin::added_via_api::true
kuma:envoy:admin::127.0.0.1:9901::cx_active::4
kuma:envoy:admin::127.0.0.1:9901::cx_connect_fail::0
kuma:envoy:admin::127.0.0.1:9901::cx_total::4
kuma:envoy:admin::127.0.0.1:9901::rq_active::1
kuma:envoy:admin::127.0.0.1:9901::rq_error::0
kuma:envoy:admin::127.0.0.1:9901::rq_success::43
kuma:envoy:admin::127.0.0.1:9901::rq_timeout::0
kuma:envoy:admin::127.0.0.1:9901::rq_total::44
kuma:envoy:admin::127.0.0.1:9901::hostname::
kuma:envoy:admin::127.0.0.1:9901::health_flags::healthy
kuma:envoy:admin::127.0.0.1:9901::weight::1
kuma:envoy:admin::127.0.0.1:9901::region::
kuma:envoy:admin::127.0.0.1:9901::zone::
kuma:envoy:admin::127.0.0.1:9901::sub_zone::
kuma:envoy:admin::127.0.0.1:9901::canary::false
kuma:envoy:admin::127.0.0.1:9901::priority::0
kuma:envoy:admin::127.0.0.1:9901::success_rate::-1
kuma:envoy:admin::127.0.0.1:9901::local_origin_success_rate::-1
ads_cluster::observability_name::ads_cluster
ads_cluster::default_priority::max_connections::1024
ads_cluster::default_priority::max_pending_requests::1024
ads_cluster::default_priority::max_requests::1024
ads_cluster::default_priority::max_retries::3
ads_cluster::high_priority::max_connections::1024
ads_cluster::high_priority::max_pending_requests::1024
ads_cluster::high_priority::max_requests::1024
ads_cluster::high_priority::max_retries::3
ads_cluster::added_via_api::false
ads_cluster::10.43.138.71:5678::cx_active::1
ads_cluster::10.43.138.71:5678::cx_connect_fail::0
ads_cluster::10.43.138.71:5678::cx_total::1
ads_cluster::10.43.138.71:5678::rq_active::1
ads_cluster::10.43.138.71:5678::rq_error::0
ads_cluster::10.43.138.71:5678::rq_success::0
ads_cluster::10.43.138.71:5678::rq_timeout::0
ads_cluster::10.43.138.71:5678::rq_total::1
ads_cluster::10.43.138.71:5678::hostname::kuma-control-plane.kuma-system
ads_cluster::10.43.138.71:5678::health_flags::healthy
ads_cluster::10.43.138.71:5678::weight::1
ads_cluster::10.43.138.71:5678::region::
ads_cluster::10.43.138.71:5678::zone::
ads_cluster::10.43.138.71:5678::sub_zone::
ads_cluster::10.43.138.71:5678::canary::false
ads_cluster::10.43.138.71:5678::priority::0
ads_cluster::10.43.138.71:5678::success_rate::-1
ads_cluster::10.43.138.71:5678::local_origin_success_rate::-1`,
  }
}
