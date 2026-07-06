import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ResortPage from './pages/ResortPage';
import { ResortProvider } from './context/ResortContext';

export default function App() {
  return (
    <ResortProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resort/:id" element={<ResortPage />} />
        </Routes>
      </Layout>
    </ResortProvider>
  );
}
