import type I18n from './I18n'
export default (i18n: ReturnType<typeof I18n>) => {
  return {
    ...i18n,
    t: (
      ...rest: Parameters<ReturnType<typeof I18n>['t']>
    ) => rest[0],
  }
}
