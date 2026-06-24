import type { ButtonCustomProps } from "../helper/Types"

export default function ButtonCustom({ text, onClick, className, type, disabled }: ButtonCustomProps) {
    return (
        <button type={type} disabled={disabled} onClick={onClick} className={`${className} bg-primary-3 hover:bg-primary-4 transition-all duration-200 w-full px-5 py-5 rounded-cust cursor-pointer`}>
            <h1 className="text-primary-2 font-jost text-3xl">{text}</h1>
        </button>
    )
}