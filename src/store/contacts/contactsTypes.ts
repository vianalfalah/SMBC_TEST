export interface Contact {
    gender: string,
    name: {
        title: string,
        first: string,
        last: string
    },
    location: {
        street: {
            number: number,
            name: string,
        },
        city: string,
        state: string,
        country: string,
        postcode: string,
        coordinates: {
          latitude: string,
          longitude: string
        },
        timezone: {
          offset: string,
          description: string
        }
      },
      email: string,
      dob: {
        date: string,
        age: number
      },
      registered: {
        date: string,
        age: number
      },
      phone: string,
      cell: string,
      id: {
        name: string,
        value: string
      },
      picture: {
        large: string,
        medium: string,
        thumbnail: string
      },
      nat: string
}

export interface ContactResponse {
    results: Contact[]
    info: {
        seed: string
        results: number
        page: number
        version: string
    }
}

export interface ContactsState {
    items: ContactResponse
    loadingFetch: boolean
    errorFetch: string | null
    loadingAdd: boolean
    errorAdd: string | null
    loadingDelete: boolean
    errorDelete: string | null
    hasMore: boolean
    detailContact: Contact | null
}