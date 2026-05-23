import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit'
import * as api from './contactsApi'
import type { Contact, ContactsState } from './contactsTypes'
import type { AxiosResponse } from 'axios'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const dataMockLocal: Contact[] = [
    {
        "firstName": "vian",
        "lastName": "alfalah",
        "email": "vianalfa@mail.co",
        "phone": 891233,
        "company": "123",
        "age": 24,
        "id": "QHrIPc0MHvc"
    },
    {
        "firstName": "galih",
        "lastName": "prakoso",
        "email": "galihprakoso@mail.co",
        "phone": 231123,
        "company": "smbc",
        "age": 31,
        "id": "QJ_bZc4MDi4"
    }
]

export const fetchContacts = createAsyncThunk(
    'contacts/fetch',
    async (params: any) => {
        await delay(2000)
        try {
            const res: AxiosResponse | any = await api.getContacts()
            if (res?.name === 'AxiosError') {
                const dataLocal = localStorage.getItem('contacts')
                if (!dataLocal) {
                    localStorage.setItem('contacts', JSON.stringify(dataMockLocal))
                    return dataMockLocal
                }
                if (params) {
                    const filtered = JSON.parse(dataLocal).filter((item: any) =>
                        `${item.firstName} ${item.lastName} ${item.email} ${item.phone} ${item.company ?? ""}`.toLowerCase().includes(params?.trim().toLowerCase()))
                    return filtered
                }
                return JSON.parse(dataLocal)
            } else {
                if (params) {
                    const filtered = res.data.filter((item: any) =>
                        `${item.firstName} ${item.lastName} ${item.email} ${item.phone} ${item.company ?? ""}`.toLowerCase().includes(params?.trim().toLowerCase()))
                    return filtered
                }
                return res.data
            }
        } catch (error) {
            console.log(error)
            const dataLocal = localStorage.getItem('contacts')
            if (!dataLocal) {
                localStorage.setItem('contacts', JSON.stringify(dataMockLocal))
                return dataMockLocal
            }
            if (params) {
                const filtered = JSON.parse(dataLocal).filter((item: any) =>
                    `${item.firstName} ${item.lastName} ${item.email} ${item.phone} ${item.company ?? ""}`.toLowerCase().includes(params?.trim().toLowerCase()))
                return filtered
            }
            return JSON.parse(dataLocal)
        }
    }
)

export const addContact = createAsyncThunk(
    'contacts/add',
    async (payload: any) => {
        await delay(1000)
        try {
            const res: AxiosResponse | any = await api.createContact(payload)
            if (res?.name === 'AxiosError') {
                console.log(res?.message)
            }
            return res.data
        } catch (error: any) {
            const dataLocal = localStorage.getItem('contacts')
            const newDataLocal: any[] = dataLocal ? JSON.parse(dataLocal) : []
            newDataLocal.push({ ...payload, id: nanoid() })
            localStorage.setItem('contacts', JSON.stringify(newDataLocal))
            return newDataLocal
        }
    }
)

export const editContact = createAsyncThunk(
    'contacts/edit',
    async ({ id, payload }: any) => {
        await delay(1000)
        try {
            const res: AxiosResponse | any = await api.updateContact(id, payload)
            if (res?.name === 'AxiosError') {
                console.log(res?.message)
            }
            return res.data
        } catch (error: any) {
            const dataLocal = localStorage.getItem('contacts')
            const newDataLocal: any[] = dataLocal ? JSON.parse(dataLocal) : []
            const index = newDataLocal.findIndex((item: any) => item.id === id)
            if (index !== -1) {
                newDataLocal[index] = payload
                localStorage.setItem('contacts', JSON.stringify(newDataLocal))
                return newDataLocal
            }
            return newDataLocal
        }
    }
)

export const removeContact = createAsyncThunk(
    'contacts/remove',
    async (id: string) => {
        await delay(1000)
        try {
            const res: AxiosResponse | any = await api.deleteContact(id)
            if (res?.name === 'AxiosError') {
                console.log(res?.message)
            }
            return res.data
        } catch (error: any) {
            const dataLocal = localStorage.getItem('contacts')
            const newDataLocal: any[] = dataLocal ? JSON.parse(dataLocal) : []
            const index = newDataLocal.findIndex((item: any) => item.id === id)
            if (index !== -1) {
                newDataLocal.splice(index, 1)
                localStorage.setItem('contacts', JSON.stringify(newDataLocal))
                return newDataLocal
            }
            return newDataLocal
        }
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
                // state.items.push(action.payload)
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
                // const index = state.items.findIndex(
                //     item => item.id === action.payload.id
                // )
                // if (index !== -1) state.items[index] = action.payload
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
                // state.items = state.items.filter(
                //     item => item.id !== action.payload
                // )
                state.loadingDelete = false
            })
            .addCase(removeContact.rejected, (state, action) => {
                state.loadingDelete = false
                state.errorDelete = action.error.message || null
            })
    }
})

export default slice.reducer