import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { ContactsState } from "@/store/contacts/contactsTypes"
import { updateContact } from "@/store/contacts/contactsSlice"
import type { Contact } from "@/store/contacts/contactsTypes"
import { toast } from "sonner"

const ModalUpdate = ({ open, dataModal, onClose, refetch }: any) => {
    const dispatch = useAppDispatch()
    const { errorAdd: error, loadingAdd: loading }: ContactsState = useAppSelector((state) => state.contacts)
    const [form, setForm] = useState<Partial<Contact> | null>(dataModal)

    useEffect(() => {
        setForm(dataModal)
    }, [dataModal])

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (!form) return

        try {
            dispatch(updateContact(form as Contact))
            toast.success("Contact updated successfully")
            onClose()
            if (refetch) refetch()
        } catch (error) {
            toast.error("Failed to update contact")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-display text-2xl">Edit contact details</DialogTitle>
                    <DialogDescription>Update the email, phone, cell, and address below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field 
                        label="Email Address" 
                        type="email" 
                        required 
                        value={form?.email ?? ""} 
                        onChange={(v) => setForm({ ...form, email: v } as any)} 
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Field 
                            label="Phone" 
                            value={form?.phone ?? ""} 
                            onChange={(v) => setForm({ ...form, phone: v } as any)} 
                        />
                        <Field 
                            label="Cell" 
                            value={form?.cell ?? ""} 
                            onChange={(v) => setForm({ ...form, cell: v } as any)} 
                        />
                    </div>

                    <div className="border-t border-border my-4 pt-4 space-y-4">
                        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Address Details</p>
                        
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-1">
                                <Field 
                                    label="Street No." 
                                    type="number"
                                    value={form?.location?.street?.number !== undefined && form?.location?.street?.number !== null ? String(form.location.street.number) : ""} 
                                    onChange={(v) => setForm({ 
                                        ...form, 
                                        location: { 
                                            ...form?.location, 
                                            street: { 
                                                ...form?.location?.street, 
                                                number: v ? Number(v) : 0 
                                            } 
                                        } 
                                    } as any)} 
                                />
                            </div>
                            <div className="col-span-2">
                                <Field 
                                    label="Street Name" 
                                    value={form?.location?.street?.name ?? ""} 
                                    onChange={(v) => setForm({ 
                                        ...form, 
                                        location: { 
                                            ...form?.location, 
                                            street: { 
                                                ...form?.location?.street, 
                                                name: v 
                                            } 
                                        } 
                                    } as any)} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field 
                                label="City" 
                                value={form?.location?.city ?? ""} 
                                onChange={(v) => setForm({ 
                                    ...form, 
                                    location: { ...form?.location, city: v } 
                                } as any)} 
                            />
                            <Field 
                                label="State" 
                                value={form?.location?.state ?? ""} 
                                onChange={(v) => setForm({ 
                                    ...form, 
                                    location: { ...form?.location, state: v } 
                                } as any)} 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field 
                                label="Country" 
                                value={form?.location?.country ?? ""} 
                                onChange={(v) => setForm({ 
                                    ...form, 
                                    location: { ...form?.location, country: v } 
                                } as any)} 
                            />
                            <Field 
                                label="Postcode" 
                                value={form?.location?.postcode !== undefined && form?.location?.postcode !== null ? String(form.location.postcode) : ""} 
                                onChange={(v) => setForm({ 
                                    ...form, 
                                    location: { ...form?.location, postcode: v } 
                                } as any)} 
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                            {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ModalUpdate

function Field({
    label, value, onChange, type = "text", required = false, max, min
}: {
    label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
    max?: number; min?: number;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                {label}{required && <span className="text-accent"> *</span>}
            </Label>
            <Input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} className="h-10" {...(max && { max })} {...(min && { min })} />
        </div>
    )
}