import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Music, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './Button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Music className="w-8 h-8 text-amber-600" />
            <span className="text-xl font-bold text-slate-800">Armonía Musical</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-amber-600' 
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/servicios" 
              className={`font-medium transition-colors ${
                isActive('/servicios') 
                  ? 'text-amber-600' 
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              Servicios
            </Link>
            <Link 
              to="/acerca-de" 
              className={`font-medium transition-colors ${
                isActive('/acerca-de') 
                  ? 'text-amber-600' 
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              Acerca de
            </Link>
            <Link 
              to="/reservar" 
              className={`font-medium transition-colors ${
                isActive('/reservar') 
                  ? 'text-amber-600' 
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              Reservar
            </Link>
            <Link 
              to="/blog" 
              className={`font-medium transition-colors ${
                isActive('/blog') 
                  ? 'text-amber-600' 
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/galeria" 
              className={`font-medium transition-colors ${
                isActive('/galeria') 
                  ? 'text-amber-600' 
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              Galería
            </Link>
            <Link 
              to="/contacto" 
              className={`font-medium transition-colors ${
                isActive('/contacto') 
                  ? 'text-amber-600' 
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              Contacto
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/admin" 
                  className="font-medium text-slate-600 hover:text-amber-600 transition-colors"
                >
                  Admin
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm">Admin</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-amber-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="font-medium text-slate-600 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/servicios" 
                className="font-medium text-slate-600 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link 
                to="/acerca-de" 
                className="font-medium text-slate-600 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Acerca de
              </Link>
              <Link 
                to="/reservar" 
                className="font-medium text-slate-600 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Reservar
              </Link>
              <Link 
                to="/blog" 
                className="font-medium text-slate-600 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/galeria" 
                className="font-medium text-slate-600 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Galería
              </Link>
              <Link 
                to="/contacto" 
                className="font-medium text-slate-600 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              
              {user ? (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/admin" 
                    className="font-medium text-slate-600 hover:text-amber-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="self-start"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="self-start">Admin</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}