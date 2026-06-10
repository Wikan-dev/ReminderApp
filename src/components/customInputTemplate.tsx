import type { CustomInputProps } from "../helper/Types"

export default function CustomInputTemplate({ type, placeholder, title }: CustomInputProps) {
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-jost">{title}</h1>
            <input type={type} placeholder={placeholder} className="rounded-3xl focus:outline-0 py-4.25 px-8.75" />
        </div>
    )
}