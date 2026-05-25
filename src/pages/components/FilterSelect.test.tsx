import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { FilterSelect } from "./FilterSelect"

describe("FilterSelect Component", () => {
  const testData = [
    { name: "Male", value: "male" },
    { name: "Female", value: "female" },
  ]

  it("renders the select component with placeholder", () => {
    const mockOnChange = vi.fn()
    render(
      <FilterSelect
        data={testData}
        value={null}
        onChange={mockOnChange}
        placeholder="Select Gender"
      />
    )

    expect(screen.getByText("Select Gender")).toBeInTheDocument()
  })

  it("renders the selected value when one is provided", () => {
    const mockOnChange = vi.fn()
    render(
      <FilterSelect
        data={testData}
        value={{ name: "Female", value: "female" }}
        onChange={mockOnChange}
        placeholder="Select Gender"
      />
    )

    expect(screen.getByText("Female")).toBeInTheDocument()
  })
})
