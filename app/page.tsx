import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createCheckoutSession } from "@/app/actions"

export default function HomePage() {
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
            <form action={createCheckoutSession}>
              <Button type="submit" className="w-full">
                Pay with Stripe
              </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-center text-gray-500">Secure payments powered by Stripe</CardFooter>
      </Card>
    </div>
  )
}

