import Typography from '@mui/joy/Typography'
import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

interface MainPageProps {}

const MainPage: React.FC<MainPageProps> = () => {
  const { isAdmin } = useContext(AuthContext)
  return (
    <>
      <Typography>{isAdmin.toString()}</Typography>
    </>
  )
}

export default MainPage
