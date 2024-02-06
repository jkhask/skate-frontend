import { zodResolver } from '@hookform/resolvers/zod'
import Email from '@mui/icons-material/Email'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import Key from '@mui/icons-material/Key'
import Alert from '@mui/joy/Alert'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormHelperText from '@mui/joy/FormHelperText'
import Input from '@mui/joy/Input'
import Stack from '@mui/joy/Stack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { SignInParams } from './AuthWrapper'

const signInSchema = z.object({
  email: z.string().email({ message: 'Must be a valid email.' }),
  password: z.string().min(6, { message: 'Must be at least 6 characters.' }),
})

type SignInSchema = z.infer<typeof signInSchema>

interface SignInProps {
  handleSignIn: ({ email, password }: SignInParams) => void
}

export default function SignIn({ handleSignIn }: SignInProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({ resolver: zodResolver(signInSchema) })

  const [signInError, setSignInError] = useState('')

  return (
    <form
      onSubmit={handleSubmit(async formData => {
        setSignInError('')
        const { email, password } = formData
        try {
          await handleSignIn({
            email,
            password,
          })
        } catch (error: any) {
          console.error(error)
        }
      })}
    >
      <Stack spacing={1}>
        <FormControl error={!!errors.email}>
          <Input
            {...register('email')}
            placeholder="Email"
            startDecorator={<Email />}
            required
          />
          {!!errors.email && (
            <FormHelperText>
              <InfoOutlined />
              {errors.email?.message}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl error={!!errors.password}>
          <Input
            {...register('password')}
            placeholder="Password"
            type="password"
            startDecorator={<Key />}
            required
          />
          {!!errors.password && (
            <FormHelperText>
              <InfoOutlined />
              {errors.password?.message}
            </FormHelperText>
          )}
        </FormControl>

        <Button type="submit">Submit</Button>
        {signInError && (
          <Alert color="danger" variant="solid">
            {signInError}
          </Alert>
        )}
      </Stack>
    </form>
  )
}
