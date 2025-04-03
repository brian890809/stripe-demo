"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, CheckCircle } from "lucide-react"
import { getPaymentDetails } from "@/app/actions"

export function SuccessContent({ sessionId }: { sessionId: string }) {
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPaymentDetails() {
      const details = await getPaymentDetails(sessionId)
      setPaymentDetails(details)
      setLoading(false)
    }

    fetchPaymentDetails()
  }, [sessionId])

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = "payment-confirmation.png"
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Verifying Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!paymentDetails || !paymentDetails.success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Payment Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">We couldn't verify your payment. Please contact support.</p>
        </CardContent>
      </Card>
    )
  }

  const successMessage = `Payment Confirmed! Thank you ${paymentDetails.customerEmail} for your payment of ${paymentDetails.currency} ${paymentDetails.amount}. Transaction ID: ${paymentDetails.paymentId}`

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        <CardDescription>Your payment has been processed successfully</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md bg-gray-50 p-4">
          <p className="text-sm text-gray-700">
            <strong>Amount:</strong> {paymentDetails.currency} {paymentDetails.amount}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Email:</strong> {paymentDetails.customerEmail}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Transaction ID:</strong> {paymentDetails.paymentId}
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-sm text-gray-600">Here's your payment confirmation QR code:</p>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <QRCodeSVG id="qr-code" value={successMessage} size={200} level="M" includeMargin={true} />
          </div>
          <Button variant="outline" onClick={downloadQRCode} className="flex items-center gap-2">
            <Download size={16} />
            Download QR Code
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={() => (window.location.href = "/")}>
          Return to Home
        </Button>
      </CardFooter>
    </Card>
  )
}

