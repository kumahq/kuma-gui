import type { RouteRecordRaw } from 'vue-router'
export const routes = (): RouteRecordRaw[] => {
  return [
    {
      path: '/onboarding',
      redirect: {
        name: 'onboarding-welcome-view',
      },
      component: () => import('@/app/onboarding/views/OnboardingIndexView.vue'),
      children: [
        {
          path: 'welcome',
          name: 'onboarding-welcome-view',
          component: () => import('@/app/onboarding/views/OnboardingWelcomeView.vue'),
        },
        {
          path: 'deployment-types',
          name: 'onboarding-deployment-types-view',
          component: () => import('@/app/onboarding/views/OnboardingDeploymentTypesView.vue'),
        },
        {
          path: 'configuration-types',
          name: 'onboarding-configuration-types-view',
          component: () => import('@/app/onboarding/views/OnboardingConfigurationTypesView.vue'),
        },
        {
          path: 'multi-zone',
          name: 'onboarding-multi-zone-view',
          component: () => import('@/app/onboarding/views/OnboardingMultiZoneView.vue'),
        },
        {
          path: 'create-mesh',
          name: 'onboarding-create-mesh-view',
          component: () => import('@/app/onboarding/views/OnboardingCreateMeshView.vue'),
        },
        {
          path: 'add-services',
          name: 'onboarding-add-new-services-view',
          component: () => import('@/app/onboarding/views/OnboardingAddNewServicesView.vue'),
        },
        {
          path: 'add-services-code',
          name: 'onboarding-add-new-services-code-view',
          component: () => import('@/app/onboarding/views/OnboardingAddNewServicesCodeView.vue'),
        },
        {
          path: 'dataplanes-overview',
          name: 'onboarding-dataplanes-view',
          component: () => import('@/app/onboarding/views/OnboardingDataplanesView.vue'),
        },
        {
          path: 'completed',
          name: 'onboarding-completed-view',
          component: () => import('@/app/onboarding/views/OnboardingCompletedView.vue'),
        },
      ],
    },

  ]
}
