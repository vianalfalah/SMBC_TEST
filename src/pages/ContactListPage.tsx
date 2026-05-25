import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import type { Contact, ContactsState } from "../store/contacts/contactsTypes"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchContacts, removeContact, setDetailContact } from "../store/contacts/contactsSlice"
import { Building2, Cake, Eye, Globe, Loader2, Mail, MapPin, Mars, Pencil, Phone, Plus, Search, Trash2, Users, Venus, X } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ModalDelete from "./components/ModalDelete"
import ModalUpdate from "./components/ModalUpdate"
import ModalCreate from "./components/ModalCreate"
import { toast } from "sonner"
import _ from "lodash"
import { FilterSelect } from "./components/FilterSelect"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"

const ContactListPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { items, errorFetch: error, loadingFetch: loading, loadingDelete, errorDelete, hasMore }: ContactsState = useAppSelector((state) => state.contacts)
    console.log({ items, error, loading })
      const observerRef = useRef<HTMLDivElement | null>(null)

    const [query, setQuery] = useState("")
    const [openModal, setOpenModal] = useState<{
        isModalDelete: boolean
        isModalCreate: boolean
        dataModal: Contact | null
    }>({
        isModalDelete: false,
        isModalCreate: false,
        dataModal: null
    })
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [filter, setFilter] = useState<{
        gender: { name: string, value: string } | null
        nat: { name: string, value: string } | null
    }>({
        gender: null,
        nat: null
    })

    const fetchingData = useCallback(async () => {
        if (!hasMore || loading) return
        
        try {
            const params = _.pickBy({
                page: page,
                results: limit,
                seed: "",
                exc: "login",
                gender: filter.gender ? filter.gender.value : "",
                nat: filter.nat ? filter.nat.value : ""
            }, (item) => item !== "")
            await dispatch(fetchContacts(params)).unwrap()
        } catch (error) {
            console.error(error)
        }
    }, [dispatch, hasMore, loading, page, limit, filter])

    useEffect(() => {
        fetchingData()
    }, [page, limit])

    useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]

        if (entry.isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1)
        }
      },
      {
        root: null,
        rootMargin: '300px',
        threshold: 0,
      }
    )

    const currentRef = observerRef.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }

      observer.disconnect()
    }
  }, [hasMore, loading])

    const debounceFetching = useMemo(
        () =>
            _.debounce((val: string) => {
                setDebouncedQuery(val)
            }, 500),
        []
    )

    const handleSearch = (value: string) => {
        // setPage(1)
        setQuery(value)
        debounceFetching(value)
    }

    const handleDelete = useCallback((data: Contact) => {
        try {
            dispatch(removeContact(data))
            if (errorDelete) {
                toast.error(errorDelete)
            } else {
                setTimeout(() => {
                    toast.success("Contact deleted successfully")
                    setOpenModal({ isModalCreate: false, isModalDelete: false, dataModal: null })
                }, 500);
            }
        } catch (error: any) {
            setTimeout(() => {
                toast.error(error?.message)
            }, 500);
        }
    }, [dispatch, errorDelete])

    const dataContacts = items?.results || []

    const genderOptions = [
        { name: "Male", value: "male" },
        { name: "Female", value: "female" }
    ]

    const nationalityOptions = [
        { name: "AU", value: "au" },
        { name: "BR", value: "br" },
        { name: "CA", value: "ca" },
        { name: "CH", value: "ch" },
        { name: "DE", value: "de" },
        { name: "DK", value: "dk" },
        { name: "ES", value: "es" },
        { name: "FI", value: "fi" },
        { name: "FR", value: "fr" },
        { name: "GB", value: "gb" },
        { name: "IE", value: "ie" },
        { name: "IN", value: "in" },
        { name: "IR", value: "ir" },
        { name: "MX", value: "mx" },
        { name: "NL", value: "nl" },
        { name: "NO", value: "no" },
        { name: "NZ", value: "nz" },
        { name: "RS", value: "rs" },
        { name: "TR", value: "tr" },
        { name: "UA", value: "ua" },
        { name: "US", value: "us" }
    ]

    const handleFilter = (name: string, value: { name: string, value: string }) => {
        setFilter({ ...filter, [name]: value })
    }

    useEffect(() => {
        if (filter.gender || filter.nat) {
            if (page === 1) fetchingData()
            else setPage(1)
        }
    }, [filter])

    const handleDetail = (data: any) => {
        dispatch(setDetailContact(data))
        navigate(`/detail`)
    }

    const handleCloseModal = useCallback(() => {
        setOpenModal({ isModalCreate: false, isModalDelete: false, dataModal: null })
    }, [])

    const memoizedModals = useMemo(() => (
        <>
            <ModalDelete
                loadingDelete={loadingDelete}
                open={openModal.isModalDelete}
                onClose={handleCloseModal}
                dataModal={openModal.dataModal}
                confirmDelete={handleDelete}
            />
            <ModalCreate
                open={openModal.isModalCreate && !openModal.dataModal}
                onClose={handleCloseModal}
                refetch={fetchingData}
            />
        </>
    ), [openModal, loadingDelete, handleDelete, fetchingData, handleCloseModal])

    return (
        <div className="min-h-screen">
            <div className="mx-auto lg:flex max-w-5xl items-end justify-between gap-6 px-6 pb-8">
                <div className="">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">A quiet address book</p>
                    <h1 className="mt-3 text-5xl sm:text-6xl text-foreground">Contacts.</h1>
                    <p className="mt-3 max-w-md text-sm text-muted-foreground">
                        {dataContacts.length} {dataContacts.length === 1 ? "person" : "people"} in your circle. Keep it tidy. {"Scroll to load more..."}
                    </p>
                </div>
                <Button onClick={() => setOpenModal({ isModalCreate: true, isModalDelete: false, dataModal: null })} className="h-11 gap-2 rounded-full bg-accent px-5 text-accent-foreground hover:bg-accent/90 mt-2">
                    <Plus className="h-4 w-4" /> New contact
                </Button>
            </div>
            <div className="mx-auto max-w-5xl px-6 py-1">
                {/* <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search by name, email, phone or company…"
                        className="h-12 rounded-full border-border bg-surface pl-11 pr-4 text-sm shadow-none focus-visible:ring-accent"
                    />
                    {query && (
                        <button
                            onClick={() => handleSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                            aria-label="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div> */}
                <div className="flex gap-4 mb-6">
                     
                <FilterSelect data={genderOptions} value={filter.gender} onChange={(e) => handleFilter("gender", e)} placeholder="Select Gender" />
                <FilterSelect data={nationalityOptions} value={filter.nat} onChange={(e) => handleFilter("nat", e)} placeholder="Select Nationality" />
                </div>
               

                {!loading && dataContacts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-surface/50 py-20 text-center">
                        <p className="font-display text-2xl text-foreground">Nothing here yet</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {query ? "Try a different search." : "Add your first contact to get started."}
                        </p>
                    </div>
                ) : (
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {dataContacts.length > 0 && dataContacts.map((c, id) => (
                            <li
                                key={c?.id?.value + id}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all hover:border-accent/40 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]"
                            >
                                <div className="flex items-start gap-4">
                        
                                    <Avatar size="lg">
                                        <AvatarImage src={c?.picture?.medium ?? "https://github.com/shadcn.png"} alt={`${c.name.first} ${c.name.last}`} />
                                        <AvatarFallback>{c?.name.first?.[0]}{c?.name.last?.[0]}</AvatarFallback>
                                        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 justify-center">
                                            <p className="truncate font-display text-xl text-foreground">{c?.name?.title} {c?.name.first} {c?.name.last}</p>
                                        </div>
                                        <div className="mt-3 space-y-1.5 text-sm text-foreground/80">
                                            <p className="flex items-center gap-2 truncate"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {c?.email}</p>
                                            <p className="flex items-center gap-2 truncate"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {c?.phone}</p>
                                            <p className="flex items-center gap-2 truncate"><Cake className="h-3.5 w-3.5 text-muted-foreground" /> {c?.dob?.age}</p>
                                            <p className="flex items-center gap-2 truncate"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {c?.location?.city}, {c?.location?.country}</p>
                                            <p className="flex items-center gap-2 truncate"><Globe className="h-3.5 w-3.5 text-muted-foreground" /> {c?.nat}</p>    
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" onClick={() => handleDetail(c)}>
                                        <Eye className="h-3.5 w-3.5" /> Detail
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setOpenModal({ isModalCreate: false, isModalDelete: true, dataModal: c })} >
                                        <Trash2 className="h-3.5 w-3.5" /> Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {loading && 
                    <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading contacts…
                    </div>
                }

                {!hasMore && <p>No more contacts</p>}

                <div ref={observerRef} style={{ height: 1 }} />
            </div>
            {memoizedModals}
        </div>
    )
}

export default ContactListPage

