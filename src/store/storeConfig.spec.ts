import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { ActionHandler, ActionTree } from 'vuex'

import { State } from './storeConfig'
import { get, TOKENS } from '@/services'
import { ClientStorage } from '@/utilities/ClientStorage'

const storeConfig = get(TOKENS.storeConfig)
describe('storeConfig', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('bootstrap clears selected mesh when meshes are empty', async () => {
    const actions = storeConfig.actions as ActionTree<State, State>
    const bootstrap = actions.bootstrap as ActionHandler<State, State>

    const commit = jest.fn()
    const dispatch = jest.fn()
    const getters = {
    }
    const state = {
      meshes: {
        items: [],
      },
    }

    jest.spyOn(ClientStorage, 'get').mockImplementation(() => 'default')

    // @ts-ignore go away
    await bootstrap({ commit, dispatch, getters, state })

    expect(dispatch).toHaveBeenCalledWith('updateSelectedMesh', null)
  })

  test.each([
    [[], null, null],
    [[{ name: 'test' }], null, 'test'],
    [[{ name: 'test' }], 'all', 'test'],
    [[{ name: 'test' }], 'outdated', 'test'],
  ])('bootstrap sets reasonable selected mesh as fallback', async (meshes, storedSelectedMesh, expectedSelectedMesh) => {
    const actions = storeConfig.actions as ActionTree<State, State>
    const bootstrap = actions.bootstrap as ActionHandler<State, State>

    const commit = jest.fn()
    const dispatch = jest.fn()
    const getters = {
      'config/getStatus': 'OK',
    }
    const state = {
      meshes: {
        items: meshes,
      },
    }

    jest.spyOn(ClientStorage, 'get').mockImplementation(() => storedSelectedMesh)

    // @ts-ignore go away
    await bootstrap({ commit, dispatch, getters, state })

    expect(dispatch).toHaveBeenCalledWith('updateSelectedMesh', expectedSelectedMesh)
  })
})
