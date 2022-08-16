import { getTableData } from './tableDataUtils'
import { TableDataParams } from './tableDataUtils.types'

describe('tableDataUtils', () => {
  let params: TableDataParams

  beforeEach(() => {
    params = {
      getSingleEntity: jest.fn().mockResolvedValue({}),
      getAllEntities: jest.fn().mockResolvedValue({}),
      getAllEntitiesFromPath: jest.fn().mockResolvedValue({}),
      getAllEntitiesFromMesh: jest.fn().mockResolvedValue({}),
      mesh: 'all',
      query: null,
      size: 10,
      offset: null,
    }
  })

  describe('calls proper function based on parameters', () => {
    it('calls getAllEntities', () => {
      getTableData(params)

      expect(params.getAllEntities).toHaveBeenCalled()
    })

    it('calls getAllEntities when no mesh provided', () => {
      getTableData({ ...params, mesh: undefined })

      expect(params.getAllEntities).toHaveBeenCalled()
    })

    it('calls getAllEntitiesFromMesh', () => {
      getTableData({ ...params, mesh: 'default' })

      expect(params.getAllEntitiesFromMesh).toHaveBeenCalled()
    })

    it('calls getSingleEntity', () => {
      getTableData({ ...params, query: 'foo', mesh: 'default' })

      expect(params.getSingleEntity).toHaveBeenCalled()
    })

    it('calls getSingleEntity with mesh all', () => {
      getTableData({ ...params, query: 'foo', mesh: 'all' })

      expect(params.getSingleEntity).toHaveBeenCalled()
    })
  })

  describe('handles reponses', () => {
    it('when no corresponding function provided', async () => {
      const response = await getTableData({
        ...params,
        mesh: 'default',
        getSingleEntity: undefined,
        getAllEntitiesFromMesh: undefined,
      })

      expect(response).toMatchInlineSnapshot(`
        Object {
          "data": Array [],
          "next": false,
        }
      `)
    })

    it('without data', async () => {
      const response = await getTableData(params)

      expect(response).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {},
          ],
          "next": false,
        }
      `)
    })

    it('with single data', async () => {
      params.getAllEntities = jest.fn().mockResolvedValue({ mesh: 'foo', name: 'bar' })
      const response = await getTableData(params)

      expect(response).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "mesh": "foo",
              "name": "bar",
            },
          ],
          "next": false,
        }
      `)
    })

    it('with multiple data', async () => {
      params.getAllEntities = jest.fn().mockResolvedValue({
        items: [
          { mesh: 'foo', name: 'bar' },
          { mesh: 'bar', name: 'foo' },
        ],
        total: 2,
        next: 'http://?offset=2',
      })
      const response = await getTableData(params)

      expect(response).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "mesh": "foo",
              "name": "bar",
            },
            Object {
              "mesh": "bar",
              "name": "foo",
            },
          ],
          "next": true,
        }
      `)
    })

    it('with empty array of items', async () => {
      params.getAllEntities = jest.fn().mockResolvedValue({
        items: [],
        total: 0,
        next: null,
      })
      const response = await getTableData(params)

      expect(response).toMatchInlineSnapshot(`
        Object {
          "data": Array [],
          "next": false,
        }
      `)
    })
  })
})
