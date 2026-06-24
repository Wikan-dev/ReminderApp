import { Route, Routes, BrowserRouter } from "react-router-dom"
import HomePages from "./pages/HomePages"
import LoginPage from "./pages/LoginPage"
import SignUp from "./pages/SignUpPage"
import MainPages from "./pages/MainPages"
// import MainPage from "./pages/testing"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePages />} />
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/MainPages:id" element={<MainPages />} />
            </Routes>
        </BrowserRouter>
    )
}