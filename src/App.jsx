import Home from "./pages/Home";
import About from "./pages/About";
import Connection from "./pages/Connection";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/connect" element={<Connection />} />
      </Routes>
    </BrowserRouter>
  );
}
