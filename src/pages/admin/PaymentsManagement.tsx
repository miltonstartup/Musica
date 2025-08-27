import React from 'react'
import { Card, CardContent, CardHeader } from '../../components/Card'
import { Button } from '../../components/Button'
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

export function PaymentsManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Payments Management</h2>
          <p className="text-slate-600 mt-1">Track lesson payments and financial records</p>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-800">$3,420</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">This Month</p>
                <p className="text-2xl font-bold text-slate-800">$1,280</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-800">$540</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Avg per Lesson</p>
                <p className="text-2xl font-bold text-slate-800">$75</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-800">Payment Management Features</h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <DollarSign className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Advanced Payment Features Coming Soon</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              We're working on comprehensive payment management features including:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-lg mx-auto mb-6">
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                  Payment tracking and history
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                  Invoice generation
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                  Automatic payment reminders
                </li>
              </ul>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                  Financial reporting
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                  Multiple payment methods
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                  Tax reporting tools
                </li>
              </ul>
            </div>
            <p className="text-sm text-slate-500">
              For now, you can track payments manually through the appointments system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}