import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function MainLayout({ children }) {
  return (
    <div className="app-shell dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">
        <Navbar />
        {children}
      </main>
    </div>
  )
}