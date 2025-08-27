import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Music, Menu, X, User, LogOut, Calendar, BookOpen, Home, Info, Mail, Image as ImageIcon } from 'lucide-react' // Keep these imports
import { Button } from './Button'
import { useAuth } from '../contexts/AuthContext'
import { useIsMobile } from '../hooks/use-mobile'

export { Header }

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const isMobile = useIsMobile()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Servicios', path: '/servicios', icon: Music },
    { name: 'Acerca de', path: '/acerca-de', icon: Info },
    { name: 'Reservar', path: '/reservar', icon: Calendar },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Galería', path: '/galeria', icon: ImageIcon },
    { name: 'Contacto', path: '/contacto', icon: Mail },
  ]

  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Music className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-bold">Armonía Musical</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-1"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
            {user ? (
              <Link
                to="/admin"
                className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-1"
              >
                <User className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-1"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && isMobile && (
        <div className="md:hidden bg-slate-700 pb-4">
          <nav className="flex flex-col items-center space-y-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-white hover:text-amber-400 transition-colors flex items-center space-x-2"
                onClick={toggleMenu}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="text-white hover:text-amber-400 transition-colors flex items-center space-x-2"
                  onClick={toggleMenu}
                >
                  <User className="w-5 h-5" />
                  <span>Admin Dashboard</span>
                </Link>
                <Button
                  onClick={() => {
                    signOut();
                    toggleMenu();
                  }}
                  variant="outline"
                  className="w-auto text-white border-white hover:bg-white hover:text-slate-800"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-amber-400 transition-colors flex items-center space-x-2"
                onClick={toggleMenu}
              >
                <User className="w-5 h-5" />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}