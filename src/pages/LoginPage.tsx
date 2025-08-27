import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate, useLocation } from 'react-router-dom'
import { Music, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/Button'
import { Card, CardContent, CardHeader } from '../components/Card'
import { Spinner } from '../components/Spinner'

const loginSchema = z.object({
  email: z.string().email('Por favor ingresa una dirección de correo válida'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const { user, signIn } = useAuth()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/admin'
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  // Redirect if already logged in
  if (user) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setLoginError(null)

    try {
      await signIn(data.email, data.password)
      // Navigation will be handled by the auth context
    } catch (error) {
      setLoginError(
        error instanceof Error 
          ? error.message 
          : 'Correo o contraseña inválida. Por favor inténtalo de nuevo.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Music className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Acceso Administrativo</h2>
          <p className="mt-2 text-slate-600">
            Inicia sesión para acceder al panel de administración
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center">
              <Lock className="w-6 h-6 text-amber-600 mr-2" />
              <h3 className="text-lg font-semibold text-slate-800">Bienvenido</h3>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Ingresa tu correo"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Ingresa tu contraseña"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm">{loginError}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Iniciando Sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Solo el personal autorizado puede acceder al panel de administración.
          </p>
        </div>
      </div>
    </div>
  )
}