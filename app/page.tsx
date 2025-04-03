"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createCheckoutSession } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const result = await createCheckoutSession()
      if (result.success && result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url
      } else {
        // Handle error
        console.error("Checkout error:", result.error)
        router.push("/error")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      router.push("/error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Stripe Payment Demo</CardTitle>
          <CardDescription>Click the button below to proceed to payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="mb-6 text-gray-600">
              After successful payment, you'll receive a QR code with your payment confirmation.
            </p>
            <Button
              onClick={handleCheckout}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Pay with Stripe"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-center text-gray-500">Secure payments powered by Stripe</CardFooter>
      </Card>
    </div>
  )
}

