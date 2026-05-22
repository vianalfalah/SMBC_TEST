import { api } from "../../api/api"

export const getContacts = () => api.get('/contacts')
export const createContact = (data: any) => api.post('/contacts', data)
export const updateContact = (id: string, data: any) =>
    api.put(`/contacts/${id}`, data)
export const deleteContact = (id: string) =>
    api.delete(`/contacts/${id}`)