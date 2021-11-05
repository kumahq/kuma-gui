import { render, RenderOptions, RenderResult } from '@testing-library/vue'
import merge from 'lodash/merge'
import { StoreOptions } from 'vuex'
import Vue, { ComponentOptions } from 'vue'
import Store from '@/store'

function renderWithVuex(
  Component: typeof Vue | ComponentOptions<Vue>,
  options: RenderOptions<Vue> = { store: {}, routes: [] },
): RenderResult {
  const store: StoreOptions<any> = Store()

  // Render the component and merge the original store and the custom one
  // provided as a parameter. This way, we can alter some behaviors of the
  // initial implementation.

  return render(Component, { ...options, store: merge(store, options.store), routes: options.routes })
}

export default renderWithVuex
