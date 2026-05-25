import { createAsyncThunk, createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import * as api from './contactsApi'
import type { Contact, ContactsState } from './contactsTypes'
import type { AxiosResponse } from 'axios'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchContacts = createAsyncThunk(
    'contacts/fetch',
    async (params: any) => {
        await delay(2000)
        const res: AxiosResponse | any = await api.getContacts(params)
        if (res?.data) return res?.data
        throw new Error('No data returned from API')
    }
)

const initialState: ContactsState = {
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
}

const slice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        setDetailContact: (state, action: PayloadAction<Contact>) => {
            state.detailContact = action.payload
        },
        removeContact: (state, action: PayloadAction<Contact>) => {
            state.items.results = state.items.results.filter((item) => item.id.value !== action.payload.id.value)
        },
        addContact: (state, action: PayloadAction<Contact>) => {
            state.items.results = [action.payload, ...state.items.results]
        },
        updateContact: (state, action: PayloadAction<Contact>) => {
            const index = state.items.results.findIndex((item) => item.id.value === action.payload.id.value)
            if (index !== -1) {
                state.items.results[index] = action.payload
            }
            if (state.detailContact && state.detailContact.id.value === action.payload.id.value) {
                state.detailContact = action.payload
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.loadingFetch = true
                state.errorFetch = null
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loadingFetch = false
                if (action?.payload?.info?.page >= 20) {
                    state.hasMore = false
                }
                if (action?.payload?.info?.page === 1) {
                    state.items = action.payload
                } else {
                    state.items = { ...action.payload, results: [...state.items?.results ?? [], ...action.payload.results] }
                }
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loadingFetch = false
                state.errorFetch = action.error.message || null
            })
    }
})

export const { setDetailContact, removeContact, updateContact, addContact } = slice.actions

export default slice.reducer