import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// Mock
vi.mock('react-dom/client', () => {
  const renderMock = vi.fn()
  return {
    createRoot: vi.fn().mockReturnValue({ render: renderMock }),
  }
})

vi.mock('./App.tsx', () => ({
  default: () => <div data-testid="mocked-app">App</div>,
}))

vi.mock('./store/store.tsx', () => ({
  store: {
    dispatch: vi.fn(),
    getState: vi.fn(),
    subscribe: vi.fn(),
  },
}))


describe('main.tsx entry point', () => {
  let rootElement: HTMLDivElement

  beforeEach(() => {
    rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)

    vi.resetModules()
  })

  afterEach(() => {
    document.body.removeChild(rootElement)
  })

  it('init app with DOM and providers', async () => {
    const { createRoot } = await import('react-dom/client')

    await import('./main.tsx')

    expect(createRoot).toHaveBeenCalledWith(rootElement)

    const mockCreateRootInstance = vi.mocked(createRoot).mock.results[0].value
    expect(mockCreateRootInstance.render).toHaveBeenCalled()
  })
})
