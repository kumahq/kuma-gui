import KumaLogo from '@/app/common/KumaLogo.vue'
import GithubButton from 'vue-github-button'

export const [
  useKumaLogo,
  useGithubButton,
] = [
  () => KumaLogo,
  () => GithubButton,
]
