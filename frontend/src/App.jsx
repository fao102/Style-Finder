import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import HistoryPage from './components/HistoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container py-5">
        <Routes>
          <Route path="/" element={<ImageUploader />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
