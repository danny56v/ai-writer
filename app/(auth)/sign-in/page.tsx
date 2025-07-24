import AuthForm from '@/components/AuthForm'
import { SignInAction } from '@/lib/actions/auth'
import React from 'react'

const SignIn = () => {
  return (
    <div>
        <AuthForm action={SignInAction} buttonText='Sign In' title='Sign In'/>
    </div>
  )
}

export default SignIn