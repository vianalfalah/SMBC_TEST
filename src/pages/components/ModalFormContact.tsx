import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { ContactsState } from "@/store/contacts/contactsTypes";
import { addContact, editContact } from "@/store/contacts/contactsSlice";
import type { Contact } from "@/store/contacts/contactsTypes";
import { toast } from "sonner";

const ModalFormContact = ({ open, dataModal, onClose }: any) => {
    const dispatch = useAppDispatch()
    const { errorAdd: error, loadingAdd: loading }: ContactsState = useAppSelector((state) => state.contacts)
    const [form, setForm] = useState<Partial<Contact> | null>(dataModal)

    useEffect(() => {
        setForm(dataModal)
    }, [dataModal])

    console.log(dataModal)

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {
            form?.id ? (await dispatch(editContact(form as any)).unwrap()) : (await dispatch(addContact(form as any)).unwrap())
            if (error) {
                toast.error(error)
            } else {
                setTimeout(() => {
                    toast.success(form?.id ? "Contact updated successfully" : "Contact added successfully")
                    onClose()
                }, 1000);
            }
        } catch (error) {
            toast.error("Failed to add contact")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-display text-2xl">{form?.id ? "Edit contact" : "New contact"}</DialogTitle>
                    <DialogDescription>{form?.id ? "Update the details below." : "Add someone to your address book."}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="First name" required value={form?.firstName ?? ""} onChange={(v) => setForm({ ...form, firstName: v } as any)} />
                        <Field label="Last name" value={form?.lastName ?? ""} onChange={(v) => setForm({ ...form, lastName: v } as any)} />
                    </div>
                    <Field label="Email" type="email" required value={form?.email ?? ""} onChange={(v) => setForm({ ...form, email: v } as any)} />
                    <Field label="Phone" value={form?.phone ?? ""} onChange={(v) => setForm({ ...form, phone: v } as any)} />
                    <Field label="Company" value={form?.company ?? ""} onChange={(v) => setForm({ ...form, company: v } as any)} />
                    <Field label="Age" type="number" value={form?.age !== undefined && form?.age !== null ? String(form.age) : ""} onChange={(v) => setForm({ ...form, age: v ? Number(v) : 0 } as any)} />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                            {loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                            {form?.id ? "Save changes" : "Add contact"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ModalFormContact

function Field({
    label, value, onChange, type = "text", required = false,
}: {
    label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                {label}{required && <span className="text-accent"> *</span>}
            </Label>
            <Input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} className="h-10" />
        </div>
    );
}