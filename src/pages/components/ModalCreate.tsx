import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Loader2, Mars, Venus, Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { ContactsState } from "@/store/contacts/contactsTypes"
import { addContact } from "@/store/contacts/contactsSlice"
import type { Contact } from "@/store/contacts/contactsTypes"
import { toast } from "sonner"

const initialForm = {
    gender: "male",
    name: { title: "Mr", first: "", last: "" },
    email: "",
    phone: "",
    cell: "",
    nat: "US",
    dob: { date: new Date().toISOString(), age: 30 },
    location: {
        street: { number: 0, name: "" },
        city: "",
        state: "",
        country: "",
        postcode: "",
        coordinates: { latitude: "0", longitude: "0" },
        timezone: { offset: "0", description: "" }
    }
}

const ModalCreate = ({ open, onClose, refetch }: any) => {
    const dispatch = useAppDispatch()
    const { loadingAdd: loading }: ContactsState = useAppSelector((state) => state.contacts)
    const [form, setForm] = useState<Partial<Contact>>(initialForm)

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (!form.name?.first || !form.email) {
            toast.error("First Name and Email are required.")
            return
        }

        const maleImg =  `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99)}.jpg`
        const femaleImg =  `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 99)}.jpg`

        try {
            const newContact: Contact = {
                ...form,
                id: {
                    name: "local",
                    value: Math.random().toString(36).substring(2, 9)
                },
                picture: {
                    large: form.gender === "male" 
                        ? maleImg
                        : femaleImg,
                    medium: form.gender === "male" 
                        ? maleImg
                        : femaleImg,
                    thumbnail: form.gender === "male" 
                        ? maleImg
                        : femaleImg
                },
                registered: {
                    date: new Date().toISOString(),
                    age: 0
                }
            } as Contact

            dispatch(addContact(newContact))
            toast.success("Contact added successfully")
            onClose()
            setForm(initialForm)
            // if (refetch) refetch()
        } catch (error) {
            toast.error("Failed to save contact")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto pr-4">
                <DialogHeader>
                    <DialogTitle className="font-display text-2xl">New contact</DialogTitle>
                    <DialogDescription>Add someone new to your circle.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Identity Details</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <Field 
                                    label="Title" 
                                    value={form.name?.title ?? "Mr"} 
                                    onChange={(v) => setForm({ ...form, name: { ...form.name, title: v } as any })} 
                                />
                            </div>
                            <div className="col-span-2">
                                <Field 
                                    label="First name *" 
                                    required 
                                    value={form.name?.first ?? ""} 
                                    onChange={(v) => setForm({ ...form, name: { ...form.name, first: v } as any })} 
                                />
                            </div>
                        </div>
                        <Field 
                            label="Last name" 
                            value={form.name?.last ?? ""} 
                            onChange={(v) => setForm({ ...form, name: { ...form.name, last: v } as any })} 
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Gender</Label>
                                <div className="flex gap-2 mt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, gender: "male" })}
                                        className={`flex-1 h-9 rounded-xl border flex items-center justify-center gap-1 text-xs transition-all ${
                                            form.gender === "male"
                                                ? "border-accent bg-accent-bg text-accent font-medium shadow-sm"
                                                : "border-border hover:bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        <Mars className="h-3.5 w-3.5" /> Male
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, gender: "female" })}
                                        className={`flex-1 h-9 rounded-xl border flex items-center justify-center gap-1 text-xs transition-all ${
                                            form.gender === "female"
                                                ? "border-accent bg-accent-bg text-accent font-medium shadow-sm"
                                                : "border-border hover:bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        <Venus className="h-3.5 w-3.5" /> Female
                                    </button>
                                </div>
                            </div>
                            <div>
                                <Field 
                                    label="Age" 
                                    type="number"
                                    min={1}
                                    max={120}
                                    value={form.dob?.age !== undefined && form.dob?.age !== null ? String(form.dob.age) : "30"} 
                                    onChange={(v) => setForm({ ...form, dob: { ...form.dob, age: Number(v) } as any })} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Contact Info</p>
                        <Field 
                            label="Email Address *" 
                            type="email" 
                            required 
                            value={form.email ?? ""} 
                            onChange={(v) => setForm({ ...form, email: v })} 
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Field 
                                label="Phone" 
                                value={form.phone ?? ""} 
                                onChange={(v) => setForm({ ...form, phone: v })} 
                            />
                            <Field 
                                label="Cell" 
                                value={form.cell ?? ""} 
                                onChange={(v) => setForm({ ...form, cell: v })} 
                            />
                        </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Address Details</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-1">
                                <Field 
                                    label="Street No." 
                                    type="number"
                                    value={form.location?.street?.number !== undefined && form.location?.street?.number !== null ? String(form.location.street.number) : ""} 
                                    onChange={(v) => setForm({ 
                                        ...form, 
                                        location: { 
                                            ...form.location, 
                                            street: { ...form.location?.street, number: v ? Number(v) : 0 } 
                                        } 
                                    } as any)} 
                                />
                            </div>
                            <div className="col-span-2">
                                <Field 
                                    label="Street Name" 
                                    value={form.location?.street?.name ?? ""} 
                                    onChange={(v) => setForm({ 
                                        ...form, 
                                        location: { 
                                            ...form.location, 
                                            street: { ...form.location?.street, name: v } 
                                        } 
                                    } as any)} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field 
                                label="City" 
                                value={form.location?.city ?? ""} 
                                onChange={(v) => setForm({ 
                                    ...form, 
                                    location: { ...form.location, city: v } 
                                } as any)} 
                            />
                            <Field 
                                label="State" 
                                value={form.location?.state ?? ""} 
                                onChange={(v) => setForm({ 
                                    ...form, 
                                    location: { ...form.location, state: v } 
                                } as any)} 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field 
                                label="Country" 
                                value={form.location?.country ?? ""} 
                                onChange={(v) => setForm({ 
                                    ...form, 
                                    location: { ...form.location, country: v } 
                                } as any)} 
                            />
                            <Field 
                                label="Postcode" 
                                value={form.location?.postcode ?? ""} 
                                onChange={(v) => setForm({ 
                                    ...form, 
                                    location: { ...form.location, postcode: v } 
                                } as any)} 
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-border">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl gap-1.5">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Create Contact
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ModalCreate

function Field({
    label, value, onChange, type = "text", required = false, max, min
}: {
    label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
    max?: number; min?: number;
}) {
    return (
        <div className="space-y-1.5 text-left">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                {label}
            </Label>
            <Input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} className="h-9" {...(max && { max })} {...(min && { min })} />
        </div>
    )
}
