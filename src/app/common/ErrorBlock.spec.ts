import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import ErrorBlock from './ErrorBlock.vue'
import { ApiError } from '@/services/kuma-api/ApiError'

function renderComponent(props: any = {}) {
  return mount(ErrorBlock, {
    props,
  })
}

describe('ErrorBlock.vue', () => {
  test.each([
    {
      error: new Error('Something went wrong'),
      expectedTitle: 'An error has occurred while trying to load this data',
      expectedMessage: 'Something went wrong',
    },
    {
      error: new ApiError({
        status: 404,
        title: 'Could not find resource',
        detail: 'Not Found',
      }),
      expectedTitle: 'Not Found',
      expectedMessage: 'Could not find resource',
    },
  ])('has expected title and message', ({ error, expectedTitle, expectedMessage }) => {
    const wrapper = renderComponent({ error })

    expect(wrapper.find('.empty-state-title').html()).toContain(expectedTitle)
    expect(wrapper.find('.empty-state-content').html()).toContain(expectedMessage)
  })

  test.each([
    {
      error: new ApiError({
        status: 404,
        title: 'Could not find resource',
        detail: 'Not Found',
        type: '/std-errors',
        instance: '123456',
      }),
      expectedStatus: '404',
      expectedType: '/std-errors',
      expectedTrace: '123456',
    },
  ])('has expected content for ApiError', ({ error, expectedStatus, expectedType, expectedTrace }) => {
    const wrapper = renderComponent({ error })

    expect(wrapper.find('[data-testid="error-status"]').html()).toContain(expectedStatus)
    expect(wrapper.find('[data-testid="error-type"]').html()).toContain(expectedType)
    expect(wrapper.find('[data-testid="error-trace"]').html()).toContain(expectedTrace)
  })

  test.each([
    {
      error: new ApiError({
        status: 400,
        title: 'There is something with the request',
        detail: 'Bad Request',
        invalidParameters: [
          {
            field: 'name',
            reason: 'is required',
          },
        ],
      }),
      expectedInvalidParameters: [
        'Field name: is required',
      ],
    },
    {
      error: new ApiError({
        status: 400,
        title: 'There is something with the request',
        detail: 'Bad Request',
        invalidParameters: [
          {
            field: 'name',
            reason: "invalid characters. Valid characters are numbers, lowercase latin letters and '-', '_' symbols.",
          },
        ],
      }),
      expectedInvalidParameters: [
        "Field name: invalid characters. Valid characters are numbers, lowercase latin letters and '-', '_' symbols.",
      ],
    },
  ])('has expected invalid parameters for ApiError', ({ error, expectedInvalidParameters }) => {
    const wrapper = renderComponent({ error })

    const invalidParametersHtml = wrapper.find('[data-testid="error-invalid-parameters"]').text()
    for (const invalidParameter of expectedInvalidParameters) {
      expect(invalidParametersHtml).toContain(invalidParameter)
    }
  })
})
