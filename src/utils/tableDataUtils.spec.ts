import { getTableData } from './tableDataUtils'
import { TableDataParams } from './tableDataUtils.types'

describe('tableDataUtils', () => {
  let params: TableDataParams

  beforeEach(() => {
    params = {
      getSingleEntity: jest.fn().mockResolvedValue({}),
      getAllEntities: jest.fn().mockResolvedValue({}),
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

    it('calls getAllEntitiesFromMesh', () => {
      getTableData({ ...params, mesh: 'default' })

      expect(params.getAllEntitiesFromMesh).toHaveBeenCalled()
    })

    it('calls getSingleEntity', () => {
      getTableData({ ...params, query: 'foo', mesh: 'default' })

      expect(params.getSingleEntity).toHaveBeenCalled()
    })
  })

  describe('handles reponses', () => {
    it('without data', async () => {
      const response = await getTableData(params)

      expect(response).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {},
          ],
          "next": null,
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
          "next": null,
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
          "next": "2",
        }
      `)
    })
  })
})
