import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import { getTableData } from './tableDataUtils'
import { TableDataParams } from './tableDataUtils.types'

describe('tableDataUtils', () => {
  let params: TableDataParams

  beforeEach(() => {
    params = {
      getSingleEntity: jest.fn().mockReturnValue(Promise.resolve({})),
      getAllEntities: jest.fn().mockReturnValue(Promise.resolve({})),
      getAllEntitiesFromPath: jest.fn().mockReturnValue(Promise.resolve({})),
      getAllEntitiesFromMesh: jest.fn().mockReturnValue(Promise.resolve({})),
      query: null,
      size: 10,
      offset: null,
    }
  })

  describe('calls proper function based on parameters', () => {
    test('calls getAllEntities', () => {
      getTableData(params)

      expect(params.getAllEntities).toHaveBeenCalled()
    })

    test('calls getAllEntities when no mesh provided', () => {
      getTableData({ ...params, mesh: undefined })

      expect(params.getAllEntities).toHaveBeenCalled()
    })

    test('calls getAllEntitiesFromMesh', () => {
      getTableData({ ...params, mesh: 'test-mesh' })

      expect(params.getAllEntitiesFromMesh).toHaveBeenCalled()
    })

    test('calls getSingleEntity', () => {
      getTableData({ ...params, query: 'foo', mesh: 'test-mesh' })

      expect(params.getSingleEntity).toHaveBeenCalled()
    })
  })

  describe('handles reponses', () => {
    test('when no corresponding function provided', async () => {
      const response = await getTableData({
        ...params,
        mesh: 'test-mesh',
        getSingleEntity: undefined,
        getAllEntitiesFromMesh: undefined,
      })

      expect(response).toMatchInlineSnapshot(`
{
  "data": [],
  "next": false,
}
`)
    })

    test('without data', async () => {
      const response = await getTableData(params)

      expect(response).toMatchInlineSnapshot(`
{
  "data": [
    {},
  ],
  "next": false,
}
`)
    })

    test('with single data', async () => {
      params.getAllEntities = jest.fn().mockReturnValue(Promise.resolve({ mesh: 'foo', name: 'bar' }))
      const response = await getTableData(params)

      expect(response).toMatchInlineSnapshot(`
{
  "data": [
    {
      "mesh": "foo",
      "name": "bar",
    },
  ],
  "next": false,
}
`)
    })

    test('with multiple data', async () => {
      params.getAllEntities = jest.fn().mockReturnValue(Promise.resolve({
        items: [
          { mesh: 'foo', name: 'bar' },
          { mesh: 'bar', name: 'foo' },
        ],
        total: 2,
        next: 'http://?offset=2',
      }))
      const response = await getTableData(params)

      expect(response).toMatchInlineSnapshot(`
{
  "data": [
    {
      "mesh": "foo",
      "name": "bar",
    },
    {
      "mesh": "bar",
      "name": "foo",
    },
  ],
  "next": true,
}
`)
    })

    test('with empty array of items', async () => {
      params.getAllEntities = jest.fn().mockReturnValue(Promise.resolve({
        items: [],
        total: 0,
        next: null,
      }))
      const response = await getTableData(params)

      expect(response).toMatchInlineSnapshot(`
{
  "data": [],
  "next": false,
}
`)
    })
  })
})
