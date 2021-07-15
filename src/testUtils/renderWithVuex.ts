import { render, RenderOptions, RenderResult } from '@testing-library/vue'
import { StoreOptions } from 'vuex'
import Vue, { ComponentOptions } from 'vue'
import Store from '@/store'
import Kuma from '@/services/kuma'

function renderWithVuex(Component: ComponentOptions<Vue>, options: RenderOptions<Vue> = { store: {}, routes: [] }): RenderResult {
  const kuma: Kuma = new Kuma();
  const store: StoreOptions<any> = Store(kuma)

  // Render the component and merge the original store and the custom one
  // provided as a parameter. This way, we can alter some behaviors of the
  // initial implementation.

  return render(Component, { ...options, store: { ...store, ...options.store }, routes: options.routes || [] })
}

export default renderWithVuex
