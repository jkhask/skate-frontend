import Box from '@mui/joy/Box'
import { useContext, useEffect, useState } from 'react'
import { Skater } from '../API'
import { AuthContext } from '../contexts/AuthContext'
import { listSkaters } from '../services/skaters'
import SkaterCard from './SkaterCard'

interface MainPageProps {}

const MainPage: React.FC<MainPageProps> = () => {
  const { isAdmin } = useContext(AuthContext)
  const [skaters, setSkaters] = useState<Skater[]>([])

  useEffect(() => {
    ;(async () => {
      if (isAdmin) {
        const skaters = (await listSkaters()) as Skater[]
        setSkaters(skaters)
      }
    })()
  }, [isAdmin])

  return (
    <Box sx={{ display: 'flex', gap: 4, mt: 4 }}>
      {skaters.map((skater, i) => (
        <SkaterCard {...{ skater }} key={i} />
      ))}
    </Box>
  )
}

export default MainPage
