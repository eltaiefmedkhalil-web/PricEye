import { useState } from 'react'
import { StripeProduct } from '../stripe-config'
import { supabase } from '../lib/supabase'

interface ProductCardProps {
  product: StripeProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Non authentifié')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          {product.mode === 'subscription' ? 'Abonnement' : 'Paiement unique'}
        </span>
      </div>
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Chargement...' : 'Acheter'}
      </button>
    </div>
  )
}