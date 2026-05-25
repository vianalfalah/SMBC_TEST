import { useState } from "react"
import { useAppSelector, useAppDispatch } from "../store/hooks"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ArrowLeft, Mail, Phone, MapPin, User, Flag, Clipboard, Mars, Venus, Pencil } from "lucide-react"
import type { Contact } from "@/store/contacts/contactsTypes"
import { updateContact } from "@/store/contacts/contactsSlice"
import ModalUpdate from "./components/ModalUpdate"

const DetailContact = () => {
    const { detailContact } = useAppSelector(state => state.contacts)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const handleCopy = (text: string | undefined, type: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        toast.success(`${type} copied to clipboard!`)
    }

    // const handleEdit = (contact: Contact) => {
    //     dispatch(updateContact(contact))
    //     toast.success("Contact updated successfully")
    // }

    if (!detailContact) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">No contact selected</h2>
                <p className="text-muted-foreground mt-2 max-w-sm">
                    It seems you reloaded the page or accessed this URL directly. Go back to find a contact.
                </p>
                <Button 
                    onClick={() => navigate('/')} 
                    className="mt-6 h-11 gap-2 rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Contacts
                </Button>
            </div>
        )
    }

    console.log(detailContact)

    return (
        <div className="mx-auto max-w-3xl text-left animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Button 
                onClick={() => navigate('/')} 
                variant="ghost" 
                className="mb-6 h-10 gap-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Contacts
            </Button>

            <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-xl">
                <div className="h-32 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent relative" />
                
                <div className="relative px-6 pb-6 text-center sm:text-left sm:flex sm:items-end sm:gap-6 -mt-16">
                    <div className="relative mx-auto sm:mx-0 w-32 h-32 rounded-full border-4 border-surface bg-surface overflow-hidden shadow-md group">
                        <img 
                            src={detailContact?.picture?.large} 
                            alt={`${detailContact?.name?.first} ${detailContact?.name?.last}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground capitalize mb-2">
                                    {detailContact?.gender === 'male' ? <Mars className="h-3 w-3 text-blue-500" /> : <Venus className="h-3 w-3 text-pink-500" />}
                                    {detailContact?.gender}
                                </span>
                                <h1 className="text-3xl font-semibold tracking-tight text-foreground capitalize">
                                    {detailContact?.name?.title}. {detailContact?.name?.first} {detailContact?.name?.last}
                                </h1>
                                <div className="text-muted-foreground text-sm flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                                    <Mail className="h-3.5 w-3.5" />
                                    <span>{detailContact?.email}</span>
                                    <button 
                                        onClick={() => handleCopy(detailContact?.email, "Email")}
                                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                                        title="Copy email"
                                    >
                                        <Clipboard className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex justify-center sm:justify-end gap-2">
                                <Button 
                                    onClick={() => setIsEditModalOpen(true)}
                                    variant="outline" 
                                    className="rounded-full h-9 px-4 text-xs font-medium gap-1.5 border border-border hover:bg-muted"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit Contact
                                </Button>
                                <Button 
                                    onClick={() => handleCopy(detailContact?.phone, "Phone number")}
                                    variant="secondary" 
                                    className="rounded-full h-9 px-4 text-xs font-medium border border-border"
                                >
                                    Copy Phone
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
                <div className="rounded-3xl border border-border bg-surface p-6 space-y-6">
                    <h3 className="text-lg font-medium text-foreground border-b border-border pb-3 flex items-center gap-2">
                        <User className="h-5 w-5 text-accent" />
                        Personal Details
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Age</span>
                            <span className="font-medium text-foreground">{detailContact?.dob?.age} years old</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Date of Birth</span>
                            <span className="font-medium text-foreground">
                                {detailContact?.dob?.date ? new Date(detailContact.dob.date).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : ''}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Nationality</span>
                            <span className="font-medium text-foreground flex items-center gap-1.5 uppercase">
                                <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                                {detailContact?.nat}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-sm pb-1">
                            <span className="text-muted-foreground">Member Since</span>
                            <span className="font-medium text-foreground">
                                {detailContact?.registered?.date ? new Date(detailContact.registered.date).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long'
                                }) : ''}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-border bg-surface p-6 space-y-6">
                    <h3 className="text-lg font-medium text-foreground border-b border-border pb-3 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-accent" />
                        Contact & Address
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-start text-sm border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Phone</span>
                            <span className="font-medium text-foreground flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                {detailContact?.phone}
                            </span>
                        </div>

                        <div className="flex justify-between items-start text-sm border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Cell</span>
                            <span className="font-medium text-foreground flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                {detailContact?.cell}
                            </span>
                        </div>

                        <div className="flex justify-between items-start text-sm border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Address</span>
                            <span className="font-medium text-foreground text-right max-w-[200px] capitalize">
                                {detailContact?.location?.street?.number} {detailContact?.location?.street?.name},<br />
                                {detailContact?.location?.city}, {detailContact?.location?.state},<br />
                                {detailContact?.location?.country}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-sm pb-1">
                            <span className="text-muted-foreground">Postcode</span>
                            <span className="font-medium text-foreground">{detailContact?.location?.postcode}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ModalUpdate
                open={isEditModalOpen}
                dataModal={detailContact}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    )
}

export default DetailContact