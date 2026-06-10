import { Route, Routes, BrowserRouter } from "react-router-dom"
import MainPage from "./pages/landingPage"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
            </Routes>
        </BrowserRouter>
    )
}