import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: '/onboarding',
      redirect: {
        name: 'onboarding-welcome',
      },
      component: () => import('@/app/onboarding/views/OnboardingView.vue'),
      children: [
        {
          path: 'welcome',
          name: 'onboarding-welcome',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/WelcomeView.vue'),
        },
        {
          path: 'deployment-types',
          name: 'onboarding-deployment-types',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/DeploymentTypes.vue'),
        },
        {
          path: 'configuration-types',
          name: 'onboarding-configuration-types',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/ConfigurationTypes.vue'),
        },
        {
          path: 'multi-zone',
          name: 'onboarding-multi-zone',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/MultiZoneView.vue'),
        },
        {
          path: 'create-mesh',
          name: 'onboarding-create-mesh',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/CreateMesh.vue'),
        },
        {
          path: 'add-services',
          name: 'onboarding-add-services',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/AddNewServices.vue'),
        },
        {
          path: 'add-services-code',
          name: 'onboarding-add-services-code',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/AddNewServicesCode.vue'),
        },
        {
          path: 'dataplanes-overview',
          name: 'onboarding-dataplanes-overview',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/DataplanesOverview.vue'),
        },
        {
          path: 'completed',
          name: 'onboarding-completed',
          meta: {
            onboardingProcess: true,
          },
          component: () => import('@/app/onboarding/views/CompletedView.vue'),
        },
      ],
    },

  ]
}
