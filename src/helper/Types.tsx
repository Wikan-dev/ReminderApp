export interface Reminder {
    name: string;
    isPermanent: boolean;
    isFinish: boolean;
    DatePick: string;
    color: string;
    desc: string;
}

export interface ButtonCustomProps {
    text: string;
    onClick?: () => void;
    className?: string;
}

export interface LogoButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
    logo?: string;
}

export interface CustomInputProps {
    type: string;
    placeholder: string
    title: string;
}