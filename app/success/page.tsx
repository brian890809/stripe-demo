import { Suspense } from "react"
import { SuccessContent } from "./success-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Invalid Session</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">No valid payment session was found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<PaymentLoadingState />}>
        <SuccessContent sessionId={sessionId} />
      </Suspense>
    </div>
  )
}

function PaymentLoadingState() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Processing Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600"></div>
        </div>
        <p className="text-center text-gray-600">Please wait while we verify your payment...</p>
      </CardContent>
    </Card>
  )
}

