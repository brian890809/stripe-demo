"use server"

import { redirect } from "next/navigation"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function createCheckoutSession() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const createSessionObj = {
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Demo Product",
            description: "This is a demo product for testing Stripe integration",
          },
          unit_amount: 1000, // $10.00
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}`,
  }
  try {
    const session = await stripe.checkout.sessions.create(createSessionObj)
    console.log("seesion")
    console.log(session)
    const { url } = session
    if (url) {
      console.log(url)
      redirect(url)
    }
  } catch (error) {
    console.log("error")
    console.log(error)
    console.error("Error creating checkout session:", error)
    redirect(`${baseUrl}/error`)
  }
}

export async function getPaymentDetails(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return {
      success: true,
      customerEmail: session.customer_details?.email || "Customer",
      amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00",
      currency: session.currency?.toUpperCase() || "USD",
      paymentId: session.payment_intent as string,
    }
  } catch (error) {
    console.error("Error retrieving payment details:", error)
    return { success: false }
  }
}

