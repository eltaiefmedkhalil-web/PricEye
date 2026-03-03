import { SignupForm } from '../components/SignupForm'
import SEO from '../components/SEO'

export function Signup() {
  return (
    <>
      <SEO
        title="Start Your Free Trial"
        description="Sign up for PricEye AI and start optimizing your Airbnb and short-term rental pricing today. 30-day free trial, no credit card required."
        canonical="/signup"
      />
      <SignupForm />
    </>
  )
}