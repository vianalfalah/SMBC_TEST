import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import * as api from './contactsApi'
import reducer, { fetchContacts, addContact, updateContact, removeContact, setDetailContact } from './contactsSlice'
import type { Contact } from './contactsTypes'

vi.mock('./contactsApi', () => ({
  getContacts: vi.fn(),
}))

const mockApi = api as any

const mockContact: Contact = {
  gender: 'male',
  name: { title: 'Mr', first: 'John', last: 'Doe' },
  location: {
    street: { number: 123, name: 'Main St' },
    city: 'Springfield',
    state: 'IL',
    country: 'USA',
    postcode: '62701',
    coordinates: { latitude: '0', longitude: '0' },
    timezone: { offset: '0', description: '' }
  },
  email: 'john@example.com',
  dob: { date: '1990-01-01', age: 35 },
  registered: { date: '2020-01-01', age: 5 },
  phone: '123-456-7890',
  cell: '098-765-4321',
  id: { name: 'local', value: '1' },
  picture: { large: '', medium: '', thumbnail: '' },
  nat: 'US'
}

describe('contactsSlice', () => {
  let store: any

  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    vi.clearAllMocks()

    store = configureStore({
      reducer: {
        contacts: reducer,
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return the initial state', () => {
    const state = store.getState().contacts
    expect(state).toEqual({
      items: {
        results: [],
        info: {
          seed: '',
          results: 0,
          page: 0,
          version: ''
        }
      },
      loadingFetch: false,
      errorFetch: null,
      loadingAdd: false,
      errorAdd: null,
      loadingDelete: false,
      errorDelete: null,
      hasMore: true,
      detailContact: null
    })
  })

  it('should handle setDetailContact', () => {
    store.dispatch(setDetailContact(mockContact))
    const state = store.getState().contacts
    expect(state.detailContact).toEqual(mockContact)
  })

  it('should handle addContact', () => {
    store.dispatch(addContact(mockContact))
    const state = store.getState().contacts
    expect(state.items.results).toHaveLength(1)
    expect(state.items.results[0]).toEqual(mockContact)
  })

  it('should handle updateContact', () => {
    store.dispatch(addContact(mockContact))
    store.dispatch(setDetailContact(mockContact))

    const updatedContact = {
      ...mockContact,
      email: 'newjohn@example.com'
    }

    store.dispatch(updateContact(updatedContact))
    const state = store.getState().contacts
    
    expect(state.items.results[0].email).toBe('newjohn@example.com')
    expect(state.detailContact?.email).toBe('newjohn@example.com')
  })

  it('should handle removeContact', () => {
    store.dispatch(addContact(mockContact))
    let state = store.getState().contacts
    expect(state.items.results).toHaveLength(1)

    store.dispatch(removeContact(mockContact))
    state = store.getState().contacts
    expect(state.items.results).toHaveLength(0)
  })

  describe('fetchContacts async thunk', () => {
    it('should handle pending state', () => {
      mockApi.getContacts.mockReturnValue(new Promise(() => {}))
      store.dispatch(fetchContacts(null))
      const state = store.getState().contacts
      expect(state.loadingFetch).toBe(true)
      expect(state.errorFetch).toBeNull()
    })

    it('should successfully fetch contacts on page 1', async () => {
      const mockResponse = {
        results: [mockContact],
        info: { seed: 'contacts', results: 1, page: 1, version: '1.0' }
      }
      mockApi.getContacts.mockResolvedValue({ data: mockResponse })

      const promise = store.dispatch(fetchContacts(null))
      vi.advanceTimersByTime(2000)
      await promise

      const state = store.getState().contacts
      expect(state.loadingFetch).toBe(false)
      expect(state.items).toEqual(mockResponse)
    })

    it('should append fetched contacts on page > 1', async () => {
      const mockResponse1 = {
        results: [mockContact],
        info: { seed: 'contacts', results: 1, page: 1, version: '1.0' }
      }
      mockApi.getContacts.mockResolvedValue({ data: mockResponse1 })
      let promise = store.dispatch(fetchContacts(null))
      vi.advanceTimersByTime(2000)
      await promise

      const mockContact2 = { ...mockContact, id: { name: 'local', value: '2' }, email: 'two@example.com' }
      const mockResponse2 = {
        results: [mockContact2],
        info: { seed: 'contacts', results: 1, page: 2, version: '1.0' }
      }
      mockApi.getContacts.mockResolvedValue({ data: mockResponse2 })

      promise = store.dispatch(fetchContacts(null))
      vi.advanceTimersByTime(2000)
      await promise

      const state = store.getState().contacts
      expect(state.items.results).toHaveLength(2)
      expect(state.items.results[0]).toEqual(mockContact)
      expect(state.items.results[1]).toEqual(mockContact2)
    })

    it('should set hasMore to false when page >= 20', async () => {
      const mockResponse = {
        results: [mockContact],
        info: { seed: 'contacts', results: 1, page: 20, version: '1.0' }
      }
      mockApi.getContacts.mockResolvedValue({ data: mockResponse })

      const promise = store.dispatch(fetchContacts(null))
      vi.advanceTimersByTime(2000)
      await promise

      const state = store.getState().contacts
      expect(state.hasMore).toBe(false)
    })

    it('should handle rejected state', async () => {
      mockApi.getContacts.mockRejectedValue(new Error('API Error'))

      const promise = store.dispatch(fetchContacts(null))
      vi.advanceTimersByTime(2000)
      await promise

      const state = store.getState().contacts
      expect(state.loadingFetch).toBe(false)
      expect(state.errorFetch).toBe('API Error')
      expect(state.items.results).toEqual([])
    })
  })
})
