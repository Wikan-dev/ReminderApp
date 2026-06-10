import type { LogoButtonProps } from "../helper/Types"

export default function LogoButton({ text, onClick, className, logo }: LogoButtonProps) {
    return (
        <button onClick={onClick} className={`${className} w-full px-5.5`}>
            <img src={logo} alt="logo image" className="w-14.5 h-14.5" />
            <h1 className="text-3xl text-primary-2">{text}</h1>
        </button>
    )
}