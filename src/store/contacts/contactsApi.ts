import { api } from "../../api/api"

export const getContacts = (params: { page: number, results: number, seed: string, exc: string }) => api.get('/', { params })