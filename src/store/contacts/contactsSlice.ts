import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from './contactsApi'
import type { ContactsState } from './contactsTypes'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchContacts = createAsyncThunk(
    'contacts/fetch',
    async (params: any) => {
        await delay(2000)
        const res = await api.getContacts()
        console.log(params)
        if (params) {
            const filtered = res.data.filter((item: any) =>
                `${item.firstName} ${item.lastName} ${item.email} ${item.phone} ${item.company ?? ""}`.toLowerCase().includes(params?.trim().toLowerCase()))
            return filtered
        }
        return res.data
    }
)

export const addContact = createAsyncThunk(
    'contacts/add',
    async (payload: any) => {
        await delay(1000)
        const res = await api.createContact(payload)
        return res.data
    }
)

export const editContact = createAsyncThunk(
    'contacts/edit',
    async ({ id, payload }: any) => {
        await delay(1000)
        const res = await api.updateContact(id, payload)
        return res.data
    }
)

export const removeContact = createAsyncThunk(
    'contacts/remove',
    async (id: string) => {
        await delay(1000)
        await api.deleteContact(id)
        return id
    }
)

const initialState: ContactsState = {
    items: [],
    loadingFetch: false,
    errorFetch: null,
    loadingAdd: false,
    errorAdd: null,
    loadingDelete: false,
    errorDelete: null,
}

const slice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.loadingFetch = true
                state.errorFetch = null
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.items = action.payload
                state.loadingFetch = false
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loadingFetch = false
                state.errorFetch = action.error.message || null
            })
        builder
            .addCase(addContact.pending, (state) => {
                state.loadingAdd = true
                state.errorAdd = null
            })
            .addCase(addContact.fulfilled, (state, action) => {
                state.items.push(action.payload)
                state.loadingAdd = false
            })
            .addCase(addContact.rejected, (state, action) => {
                state.loadingAdd = false
                state.errorAdd = action.error.message || null
            })
        builder
            .addCase(editContact.pending, (state) => {
                state.loadingAdd = true
                state.errorAdd = null
            })
            .addCase(editContact.fulfilled, (state, action) => {
                const index = state.items.findIndex(
                    item => item.id === action.payload.id
                )
                if (index !== -1) state.items[index] = action.payload
                state.loadingAdd = false
            })
            .addCase(editContact.rejected, (state, action) => {
                state.loadingAdd = false
                state.errorAdd = action.error.message || null
            })
        builder
            .addCase(removeContact.pending, (state) => {
                state.loadingDelete = true
                state.errorDelete = null
            })
            .addCase(removeContact.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    item => item.id !== action.payload
                )
                state.loadingDelete = false
            })
            .addCase(removeContact.rejected, (state, action) => {
                state.loadingDelete = false
                state.errorDelete = action.error.message || null
            })
    }
})

export default slice.reducer