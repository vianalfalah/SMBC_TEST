import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function FilterSelect({ data, value, onChange, placeholder }: { data: { name: string, value: string }[], value: { name: string, value: string }, onChange: (val: { name: string, value: string }) => void, placeholder?: string }) {

  return (
    <Select value={value?.value} onValueChange={(val) => onChange(data.find((item) => item.value === val) || {name: "", value: ""})}>
      <SelectTrigger className="h-12 rounded-full border-border bg-surface px-4 text-sm shadow-none focus-visible:ring-accent w-full max-w-48">
        <SelectValue placeholder={placeholder || "Select a value"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{placeholder || "Select a value"}</SelectLabel>
          {data.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
