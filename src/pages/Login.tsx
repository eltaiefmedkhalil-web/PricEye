import { LoginForm } from '../components/LoginForm'
import SEO from '../components/SEO'

export function Login() {
  return (
    <>
      <SEO
        title="Login to Your PricEye Account"
        description="Sign in to PricEye AI to manage your short-term rental dynamic pricing dashboard and revenue management tools."
        canonical="/login"
        noindex
      />
      <LoginForm />
    </>
  )
}