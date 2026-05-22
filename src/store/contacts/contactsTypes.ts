export interface Contact {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    company: string
    age: number
    photo?: string
}

export interface ContactsState {
    items: Contact[]
    loadingFetch: boolean
    errorFetch: string | null
    loadingAdd: boolean
    errorAdd: string | null
    loadingDelete: boolean
    errorDelete: string | null
}