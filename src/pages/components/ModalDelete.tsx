import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

const ModalDelete = ({ open, dataModal, onClose, confirmDelete, loadingDelete }: any) => {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-2xl">Delete this contact?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {dataModal && `${dataModal.firstName} ${dataModal.lastName} will be removed from your address book. This can't be undone.`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant={"ghost"} size={"lg"} onClick={() => onClose()} >Cancel</AlertDialogCancel>
                    <AlertDialogAction variant={"destructive"} size={"lg"} onClick={() => confirmDelete(dataModal)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={loadingDelete}>
                        {loadingDelete && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                        {loadingDelete ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default ModalDelete