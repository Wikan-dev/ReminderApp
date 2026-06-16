import { Route, Routes, BrowserRouter } from "react-router-dom"
import HomePages from "./pages/HomePages"
// import MainPage from "./pages/testing"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePages />} />
            </Routes>
        </BrowserRouter>
    )
}