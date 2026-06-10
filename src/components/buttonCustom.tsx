import type { ButtonCustomProps } from "../helper/Types"

export default function ButtonCustom({ text, onClick, className }: ButtonCustomProps) {
    return (
        <button onClick={onClick} className={`${className} bg-primary-3 w-full px-5`}>
            <h1 className="text-primary-2 font-jost text-3xl">{text}</h1>
        </button>
    )
}