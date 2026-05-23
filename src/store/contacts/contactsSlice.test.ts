import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import * as api from './contactsApi'
import reducer, { fetchContacts, addContact, editContact, removeContact } from './contactsSlice'
import type { Contact } from './contactsTypes'

vi.mock('./contactsApi', () => ({
  getContacts: vi.fn(),
  createContact: vi.fn(),
  updateContact: vi.fn(),
  deleteContact: vi.fn(),
}))

const mockApi = api as any

const dataMockLocal: Contact[] = [
  {
    firstName: "vian",
    lastName: "alfalah",
    email: "vianalfa@mail.co",
    phone: "0123",
    company: "123",
    age: 122123,
    id: "QHrIPc0MHvc",
  },
  {
    firstName: "asasd",
    lastName: "asdasd",
    email: "asdasd@mail.co",
    phone: "asdasd",
    company: "adsasd",
    age: 1231,
    id: "QJ_bZc4MDi4",
  },
]

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
      items: [],
      loadingFetch: false,
      errorFetch: null,
      loadingAdd: false,
      errorAdd: null,
      loadingDelete: false,
      errorDelete: null,
    })
  })

  describe('fetchContacts async thunk', () => {
    it('should handle pending state', () => {
      mockApi.getContacts.mockReturnValue(new Promise(() => {}))
      store.dispatch(fetchContacts(null))
      const state = store.getState().contacts
      expect(state.loadingFetch).toBe(true)
      expect(state.errorFetch).toBeNull()
    })

    it('should successfully fetch contacts from API', async () => {
      const mockContacts = [{ id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '1234', company: 'ABC', age: 30 }]
      mockApi.getContacts.mockResolvedValue({ data: mockContacts })

      const promise = store.dispatch(fetchContacts(null))
      vi.advanceTimersByTime(2000)
      await promise

      const state = store.getState().contacts
      expect(state.loadingFetch).toBe(false)
      expect(state.items).toEqual(mockContacts)
    })

    it('should fall back to dataMockLocal when API returns AxiosError and local storage is empty', async () => {
      mockApi.getContacts.mockResolvedValue({ name: 'AxiosError', message: 'Network Error' })

      const promise = store.dispatch(fetchContacts(null))
      vi.advanceTimersByTime(2000)
      await promise

      const state = store.getState().contacts
      expect(state.loadingFetch).toBe(false)
      expect(state.items).toEqual(dataMockLocal)
      expect(JSON.parse(localStorage.getItem('contacts') || '[]')).toEqual(dataMockLocal)
    })

    it('should fall back to localStorage items when API throws an error', async () => {
      mockApi.getContacts.mockRejectedValue(new Error('API failure'))
      const customContacts = [{ id: 'custom-1', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '5678', company: 'XYZ', age: 25 }]
      localStorage.setItem('contacts', JSON.stringify(customContacts))

      const promise = store.dispatch(fetchContacts(null))
      vi.advanceTimersByTime(2000)
      await promise

      const state = store.getState().contacts
      expect(state.loadingFetch).toBe(false)
      expect(state.items).toEqual(customContacts)
    })

    it('should filter contacts based on query params when API fails', async () => {
      mockApi.getContacts.mockRejectedValue(new Error('API failure'))
      const customContacts = [
        { id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', phone: '111', company: 'CorpA', age: 25 },
        { id: '2', firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com', phone: '222', company: 'CorpB', age: 30 },
      ]
      localStorage.setItem('contacts', JSON.stringify(customContacts))

      const promise = store.dispatch(fetchContacts('Alice'))
      vi.advanceTimersByTime(2000)
      await promise

      const state = store.getState().contacts
      expect(state.items).toHaveLength(1)
      expect(state.items[0].firstName).toBe('Alice')
    })
  })

  describe('addContact async thunk', () => {
    it('should set loadingAdd on pending', () => {
      mockApi.createContact.mockReturnValue(new Promise(() => {}))
      store.dispatch(addContact({ firstName: 'New' }))
      const state = store.getState().contacts
      expect(state.loadingAdd).toBe(true)
    })

    it('should successfully add contact via API', async () => {
      const newContact = { id: 'new-123', firstName: 'John', lastName: 'Doe' }
      mockApi.createContact.mockResolvedValue({ data: newContact })

      const promise = store.dispatch(addContact({ firstName: 'John', lastName: 'Doe' }))
      vi.advanceTimersByTime(1000)
      await promise

      const state = store.getState().contacts
      expect(state.loadingAdd).toBe(false)
      // Note: fulfilled action sets loadingAdd=false, but slice reducer items are currently commented out
      // (as seen in the contactsSlice.ts code: state.loadingAdd = false is set, but item pushing is commented out).
      // So we expect loadingAdd to be false, items to remain empty.
      expect(state.items).toEqual([])
    })

    it('should fallback and save to localStorage on API failure', async () => {
      mockApi.createContact.mockRejectedValue(new Error('API error'))
      const payload = { firstName: 'Offline', lastName: 'User', email: 'offline@mail.com', phone: '999', company: 'None', age: 20 }

      const promise = store.dispatch(addContact(payload))
      vi.advanceTimersByTime(1000)
      await promise

      const stored = JSON.parse(localStorage.getItem('contacts') || '[]')
      expect(stored).toHaveLength(1)
      expect(stored[0].firstName).toBe('Offline')
      expect(stored[0].id).toBeDefined()
    })
  })

  describe('editContact async thunk', () => {
    it('should handle API success', async () => {
      const updated = { id: '1', firstName: 'John', lastName: 'Updated' }
      mockApi.updateContact.mockResolvedValue({ data: updated })

      const promise = store.dispatch(editContact({ id: '1', payload: updated }))
      vi.advanceTimersByTime(1000)
      await promise

      const state = store.getState().contacts
      expect(state.loadingAdd).toBe(false)
    })

    it('should fallback and update localStorage on API failure', async () => {
      mockApi.updateContact.mockRejectedValue(new Error('API error'))
      const existing = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '1234', company: 'ABC', age: 30 },
      ]
      localStorage.setItem('contacts', JSON.stringify(existing))

      const updated = { id: '1', firstName: 'John', lastName: 'Modified', email: 'john@example.com', phone: '1234', company: 'ABC', age: 30 }
      const promise = store.dispatch(editContact({ id: '1', payload: updated }))
      vi.advanceTimersByTime(1000)
      await promise

      const stored = JSON.parse(localStorage.getItem('contacts') || '[]')
      expect(stored).toHaveLength(1)
      expect(stored[0].lastName).toBe('Modified')
    })
  })

  describe('removeContact async thunk', () => {
    it('should handle API success', async () => {
      mockApi.deleteContact.mockResolvedValue({ data: '1' })

      const promise = store.dispatch(removeContact('1'))
      vi.advanceTimersByTime(1000)
      await promise

      const state = store.getState().contacts
      expect(state.loadingDelete).toBe(false)
    })

    it('should fallback and remove from localStorage on API failure', async () => {
      mockApi.deleteContact.mockRejectedValue(new Error('API error'))
      const existing = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '1234', company: 'ABC', age: 30 },
      ]
      localStorage.setItem('contacts', JSON.stringify(existing))

      const promise = store.dispatch(removeContact('1'))
      vi.advanceTimersByTime(1000)
      await promise

      const stored = JSON.parse(localStorage.getItem('contacts') || '[]')
      expect(stored).toHaveLength(0)
    })
  })
})
