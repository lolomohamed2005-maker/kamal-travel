import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RootLayout } from './components/layout/RootLayout'
import { Home } from './pages/Home'
import { Packages } from './pages/Packages'
import { PackageDetail } from './pages/PackageDetail'
import { Admin } from './pages/Admin'
import { AdminLogin } from './pages/AdminLogin'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="packages" element={<Packages />} />
            <Route path="packages/:kind" element={<Packages />} />
            <Route path="package/:slug" element={<PackageDetail />} />
            <Route path="admin" element={<Admin />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
