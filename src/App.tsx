import Container from '@mui/joy/Container'
import CssBaseline from '@mui/joy/CssBaseline'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import { CssVarsProvider } from '@mui/joy/styles/CssVarsProvider'
import { Amplify } from 'aws-amplify'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthWrapper from './components/AuthWrapper'
import MainPage from './components/MainPage'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID!,
      identityPoolId: process.env.REACT_APP_AUTH_IDENTITY_POOL_ID!,
      userPoolClientId: process.env.REACT_APP_AUTH_USER_POOL_CLIENT_ID!,
      signUpVerificationMethod: 'link',
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.REACT_APP_API_ENDPOINT!,
      region: 'us-east-1',
      defaultAuthMode: 'userPool',
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
])

export default function App() {
  return (
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
      <Container
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Typography
          level="h1"
          sx={{
            fontWeight: 'xl',
            fontSize: 'clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)',
            mb: 4,
          }}
        >
          CLT Free Skate
        </Typography>
        <Sheet
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            borderRadius: 8,
            gap: 4,
            p: 4,
            justifyContent: 'center',
            minWidth: 400,
          }}
        >
          <AuthWrapper>
            <RouterProvider {...{ router }} />
          </AuthWrapper>
        </Sheet>
      </Container>
    </CssVarsProvider>
  )
}
