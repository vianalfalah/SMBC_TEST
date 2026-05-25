import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import ModalDelete from "./ModalDelete"
import type { Contact } from "@/store/contacts/contactsTypes"

describe("ModalDelete Component", () => {
  const mockContact: Partial<Contact> = {
    name: { title: "Mr", first: "John", last: "Doe" },
    id: { name: "test", value: "123" }
  }

  it("renders correctly and displays the contact's name when open", () => {
    const mockOnClose = vi.fn()
    const mockConfirmDelete = vi.fn()

    render(
      <ModalDelete
        open={true}
        dataModal={mockContact as Contact}
        onClose={mockOnClose}
        confirmDelete={mockConfirmDelete}
        loadingDelete={false}
      />
    ) 

    expect(screen.getByText("Delete this contact?")).toBeInTheDocument()

    expect(screen.getByText(/John Doe will be removed from your address book/i)).toBeInTheDocument()
  })

  it("calls onClose when Cancel button is clicked", () => {
    const mockOnClose = vi.fn()
    const mockConfirmDelete = vi.fn()

    render(
      <ModalDelete
        open={true}
        dataModal={mockContact as Contact}
        onClose={mockOnClose}
        confirmDelete={mockConfirmDelete}
        loadingDelete={false}
      />
    )

    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it("calls confirmDelete when Delete button is clicked", () => {
    const mockOnClose = vi.fn()
    const mockConfirmDelete = vi.fn()

    render(
      <ModalDelete
        open={true}
        dataModal={mockContact as Contact}
        onClose={mockOnClose}
        confirmDelete={mockConfirmDelete}
        loadingDelete={false}
      />
    )

    const deleteButton = screen.getByRole("button", { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(mockConfirmDelete).toHaveBeenCalledWith(mockContact)
  })

  it("disables the Delete button and displays loading text when loadingDelete is true", () => {
    const mockOnClose = vi.fn()
    const mockConfirmDelete = vi.fn()

    render(
      <ModalDelete
        open={true}
        dataModal={mockContact as Contact}
        onClose={mockOnClose}
        confirmDelete={mockConfirmDelete}
        loadingDelete={true}
      />
    )

    const deleteButton = screen.getByRole("button", { name: /deleting/i })
    expect(deleteButton).toBeDisabled()
    expect(screen.getByText("Deleting...")).toBeInTheDocument()
  })
})
