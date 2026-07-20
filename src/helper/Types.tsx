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
    type?: 'submit' | 'reset' | 'button';
    disabled?: boolean;
}

export interface LogoButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
    logo?: string;
}

export interface CustomInputProps {
    type: 'email' | 'password' | 'text';
    placeholder: string
    title: string;
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
}

export interface MainCardProps {
    title: string;
    desc: string;
    datePick: string;
    status: 'done' | 'pending';
    Permanent?: boolean;
    handleFinish?: () => void;
}