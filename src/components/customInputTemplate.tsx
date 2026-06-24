import type { CustomInputProps } from "../helper/Types"

export default function CustomInputTemplate({ type, placeholder, title, value, onChange, disabled }: CustomInputProps) {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-jost cursor-default">{title}</h1>
            <input value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} required type={type} placeholder={placeholder} className="rounded-3xl focus:outline-0 py-4.25 bg-white text-2xl foucs:outline-0 px-8.75" />
        </div>
    )
}