import { Route, Routes, BrowserRouter } from "react-router-dom"
import HomePages from "./pages/HomePages"
import LoginPage from "./pages/LoginPage"
// import MainPage from "./pages/testing"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePages />} />
                <Route path="/Login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}