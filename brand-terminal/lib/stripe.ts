import Stripe from "stripe";

export const getStripe = () => {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secret);
};
