import { zodResolver } from '@hookform/resolvers/zod'
import Email from '@mui/icons-material/Email'
import FavoriteIcon from '@mui/icons-material/Favorite'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import Key from '@mui/icons-material/Key'
import Person from '@mui/icons-material/Person'
import Phone from '@mui/icons-material/Phone'
import Alert from '@mui/joy/Alert'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormHelperText from '@mui/joy/FormHelperText'
import Input from '@mui/joy/Input'
import Option from '@mui/joy/Option'
import Select from '@mui/joy/Select'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { SignUpParams } from './AuthWrapper'

const signUpSchema = z
  .object({
    email: z.string().email({ message: 'Must be a valid email.' }),
    name: z.string(),
    primary: z.string(),
    password: z.string().min(6, { message: 'Must be at least 6 characters.' }),
    confirmPassword: z.string(),
    phone_number: z
      .string()
      .regex(
        new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
        'Invalid phone number.'
      )
      .length(10, { message: 'Must be 10 numbers.' }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'The passwords do not match',
      })
    }
  })

type SignUpSchema = z.infer<typeof signUpSchema>

interface SignUpProps {
  handleSignUp: (params: SignUpParams) => void
  handleAutoSignIn: () => void
}

export default function SignUp({
  handleSignUp,
  handleAutoSignIn,
}: SignUpProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({ resolver: zodResolver(signUpSchema) })

  const [signUpError, setSignUpError] = useState('')
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false)

  if (isAwaitingConfirmation) {
    return <Typography>Return here after confirming your email.</Typography>
  }

  return (
    <form
      onSubmit={handleSubmit(async formData => {
        setSignUpError('')
        const { email, name, password, phone_number, primary } = formData
        try {
          await handleSignUp({
            email,
            name,
            password,
            phone_number: `+1${phone_number}`,
            primary,
          })
        } catch (error: any) {
          setSignUpError(error.toString())
        } finally {
          setIsAwaitingConfirmation(true)
          handleAutoSignIn()
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
        <FormControl>
          <Input
            {...register('name')}
            placeholder="Full Name"
            startDecorator={<Person />}
            required
          />
        </FormControl>
        <FormControl error={!!errors.phone_number}>
          <Input
            {...register('phone_number')}
            placeholder="Phone"
            startDecorator={<Phone />}
            required
          />
          {!!errors.phone_number && (
            <FormHelperText>
              <InfoOutlined />
              {errors.phone_number?.message}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl error={!!errors.primary} {...register('primary')}>
          <Select
            placeholder="Primary"
            startDecorator={<FavoriteIcon />}
            name="primary"
            required
          >
            <Option value="quads">Quads</Option>
            <Option value="inline">Inline</Option>
            <Option value="board">Board</Option>
          </Select>
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
        <FormControl error={!!errors.confirmPassword}>
          <Input
            {...register('confirmPassword')}
            placeholder="Confirm Password"
            type="password"
            startDecorator={<Key />}
            required
          />
          {!!errors.confirmPassword && (
            <FormHelperText>
              <InfoOutlined />
              {errors.confirmPassword?.message}
            </FormHelperText>
          )}
        </FormControl>
        <Button type="submit">Submit</Button>
        {signUpError && (
          <Alert color="danger" variant="solid">
            {signUpError}
          </Alert>
        )}
      </Stack>
    </form>
  )
}
