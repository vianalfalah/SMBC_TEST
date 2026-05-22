import { useEffect, useMemo, useState } from "react"
import type { Contact, ContactsState } from "../store/contacts/contactsTypes"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { fetchContacts, removeContact } from "../store/contacts/contactsSlice"
import { Building2, Cake, Loader2, Mail, Pencil, Phone, Plus, Search, Trash2, X } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ModalDelete from "./components/ModalDelete"
import ModalFormContact from "./components/ModalFormContact"
import { toast } from "sonner"
import _ from "lodash"

const ContactListPage = () => {
    const dispatch = useAppDispatch()
    const { items, errorFetch: error, loadingFetch: loading, loadingDelete, errorDelete }: ContactsState = useAppSelector((state) => state.contacts)
    console.log({ items, error, loading })
    const [query, setQuery] = useState("")
    const [openModal, setOpenModal] = useState<{
        isModalDelete: boolean
        isModalCrud: boolean
        dataModal: Contact | null
    }>({
        isModalDelete: false,
        isModalCrud: false,
        dataModal: null
    })
    const [debouncedQuery, setDebouncedQuery] = useState(query)

    const fetchingData = async () => {
        try {
            await dispatch(fetchContacts(debouncedQuery)).unwrap()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchingData()
    }, [debouncedQuery])

    useEffect(() => {
        debounceFetching()
    }, [query])

    const debounceFetching = _.debounce(async () => {
        setDebouncedQuery(query)
    }, 500)

    // const filtered = useMemo(() => {
    //     const q = query.trim().toLowerCase();
    //     if (!q) return items;
    //     return items.filter((c) =>
    //         `${c.firstName} ${c.lastName} ${c.email} ${c.phone} ${c.company ?? ""}`.toLowerCase().includes(q),
    //     );
    // }, [items, query]);

    const avatarColor = (name: string) => {
        const colors = [
            "bg-red-500",
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-orange-500",
            "bg-indigo-500",
            "bg-teal-500",
            "bg-cyan-500",
        ]
        const index = name.split(" ")[0].length % colors.length
        return colors[index]
    }

    const handleDelete = async (data: Contact) => {
        const id = data?.id
        try {
            await dispatch(removeContact(id)).unwrap()
            if (errorDelete) {
                toast.error(errorDelete)
            } else {
                setTimeout(() => {
                    toast.success("Contact deleted successfully")
                    setOpenModal({ isModalCrud: false, isModalDelete: false, dataModal: null })
                }, 1000);
            }
        } catch (error: any) {
            setTimeout(() => {
                toast.error(error?.message)
            }, 1000);
        }
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto lg:flex max-w-5xl items-end justify-between gap-6 px-6 pb-8 pt-12 sm:pt-16">
                <div className="">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">A quiet address book</p>
                    <h1 className="mt-3 text-5xl sm:text-6xl text-foreground">Contacts.</h1>
                    <p className="mt-3 max-w-md text-sm text-muted-foreground">
                        {items.length} {items.length === 1 ? "person" : "people"} in your circle. Keep it tidy.
                    </p>
                </div>
                <Button onClick={() => setOpenModal({ isModalCrud: true, isModalDelete: false, dataModal: null })} className="h-11 gap-2 rounded-full bg-accent px-5 text-accent-foreground hover:bg-accent/90 mt-2">
                    <Plus className="h-4 w-4" /> New contact
                </Button>
            </div>
            <div className="mx-auto max-w-5xl px-6 py-1">
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, email, phone or company…"
                        className="h-12 rounded-full border-border bg-surface pl-11 pr-4 text-sm shadow-none focus-visible:ring-accent"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                            aria-label="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading contacts…
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-surface/50 py-20 text-center">
                        <p className="font-display text-2xl text-foreground">Nothing here yet</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {query ? "Try a different search." : "Add your first contact to get started."}
                        </p>
                    </div>
                ) : (
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {items.map((c) => (
                            <li
                                key={c.id}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all hover:border-accent/40 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]"
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={cn(`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg text-white ${avatarColor(`${c.firstName} ${c.lastName}`)}`)}
                                    >
                                        {c.firstName[0]}{c.lastName[0]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-display text-xl text-foreground">{c.firstName} {c.lastName}</p>
                                        {c.company && (
                                            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                                                <Building2 className="h-3 w-3" /> {c.company}
                                            </p>
                                        )}
                                        <div className="mt-3 space-y-1.5 text-sm text-foreground/80">
                                            <p className="flex items-center gap-2 truncate"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {c.email}</p>
                                            <p className="flex items-center gap-2 truncate"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {c.phone}</p>
                                            <p className="flex items-center gap-2 truncate"><Cake className="h-3.5 w-3.5 text-muted-foreground" /> {c.age}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" onClick={() => setOpenModal({ isModalCrud: true, isModalDelete: false, dataModal: c })}>
                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setOpenModal({ isModalCrud: false, isModalDelete: true, dataModal: c })} >
                                        <Trash2 className="h-3.5 w-3.5" /> Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <ModalDelete
                loadingDelete={loadingDelete}
                open={openModal.isModalDelete}
                onClose={() => setOpenModal({ isModalCrud: false, isModalDelete: false, dataModal: null })}
                dataModal={openModal.dataModal}
                confirmDelete={handleDelete}
            />
            <ModalFormContact
                open={openModal.isModalCrud}
                onClose={() => setOpenModal({ isModalCrud: false, isModalDelete: false, dataModal: null })}
                dataModal={openModal.dataModal}
            />
        </div>
    )
}

export default ContactListPage

