import ContactListPage from './pages/ContactListPage'
import { Routes, Route } from 'react-router-dom'
import DetailContact from './pages/DetailContact'

function App() {
  return (
    <div className="app p-10">
      <Routes>
        <Route path="/" element={<ContactListPage />} />
        <Route path="/detail" element={<DetailContact />} />
      </Routes>
    </div>
  )
}

export default App
