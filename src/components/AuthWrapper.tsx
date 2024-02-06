import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import CircularProgress from '@mui/joy/CircularProgress'
import Container from '@mui/joy/Container'
import Tab from '@mui/joy/Tab'
import TabList from '@mui/joy/TabList'
import TabPanel from '@mui/joy/TabPanel'
import Tabs from '@mui/joy/Tabs'
import Typography from '@mui/joy/Typography'
import {
  autoSignIn,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from 'aws-amplify/auth'
import { useEffect, useState } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'

export interface SignInParams {
  email: string
  password: string
}

export interface SignUpParams {
  email: string
  name: string
  password: string
  phone_number: string
  primary: string
}

const AuthWrapper = ({ children }: any) => {
  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true)
      const { userId } = await getCurrentUser()
      const { name } = await fetchUserAttributes()
      const session = await fetchAuthSession()
      setCurrentUser({
        userId,
        name: name!,
        isAdmin:
          (
            session.tokens?.accessToken.payload['cognito:groups'] as string[]
          )?.includes('adminGroup') ?? false,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const [currentUser, setCurrentUser] = useState({
    userId: '',
    name: '',
    isAdmin: false,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleAutoSignIn = async () => {
    try {
      const { isSignedIn } = await autoSignIn()
      if (isSignedIn) {
        fetchCurrentUser()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSignIn = async ({ email, password }: SignInParams) => {
    setIsLoading(true)
    const { isSignedIn } = await signIn({
      username: email,
      password,
    })
    if (isSignedIn) {
      await fetchCurrentUser()
    }
    setIsLoading(false)
  }

  const handleSignUp = async ({
    email,
    name,
    password,
    phone_number,
    primary,
  }: SignUpParams) => {
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          phone_number,
          name,
          'custom:primary': primary,
        },
        autoSignIn: true,
      },
    })
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut()
    setCurrentUser({
      userId: '',
      name: '',
      isAdmin: false,
    })
    setIsLoading(false)
  }

  if (isLoading) {
    return <CircularProgress />
  }

  if (currentUser.userId) {
    return (
      <Container sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography>Hello, {currentUser.name}</Typography>
          <Button onClick={() => handleSignOut()} variant="soft">
            Sign Out
          </Button>
        </Box>
        {children}
      </Container>
    )
  }
  return (
    <Tabs aria-label="Basic tabs" defaultValue={0}>
      <TabList>
        <Tab>Sign In</Tab>
        <Tab>Sign Up</Tab>
      </TabList>
      <TabPanel value={0}>
        <SignIn {...{ handleSignIn }} />
      </TabPanel>
      <TabPanel value={1}>
        <SignUp {...{ handleSignUp, handleAutoSignIn }} />
      </TabPanel>
    </Tabs>
  )
}

export default AuthWrapper
