import { motion } from 'framer-motion'
import check from '../assets/svg/baseline-check-circle.svg'

// [FIXED] - Menggunakan self-closing tag untuk elemen image
export default function SuccesAnim() {
    return (
        <motion.img src={check} className='h-10 w-10' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
    );
}