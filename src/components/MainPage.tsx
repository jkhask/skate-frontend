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

  const onUpdateSkater = (updatedSkater: Skater) => {
    const updatedSkaters = skaters.map(skater => {
      if (skater.sub === updatedSkater.sub) {
        return updatedSkater
      }
      return skater
    })
    setSkaters(updatedSkaters)
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mt: 4 }}>
      {skaters.map((skater, i) => (
        <SkaterCard {...{ skater, onUpdateSkater }} key={i} />
      ))}
    </Box>
  )
}

export default MainPage
