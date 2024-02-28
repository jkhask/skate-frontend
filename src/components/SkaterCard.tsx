import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Link from '@mui/joy/Link'
import Typography from '@mui/joy/Typography'
import { Skater } from '../API'

interface SkaterProps {
  skater: Skater
}

const SkaterCard: React.FC<SkaterProps> = ({ skater }) => {
  const { name, email, phone_number, primary, points, dateAdded } = skater
  return (
    <Card sx={{ width: 320 }}>
      <div>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography level="title-lg">{name}</Typography>
          <Typography fontSize="lg" fontWeight="lg">
            {primary}
          </Typography>
        </Box>
        <Typography level="body-sm">
          Email: <Link href={`mailto:${email}`}>{email}</Link>
        </Typography>
        <Typography level="body-sm">
          Phone: <Link href={`tel:${phone_number}`}>{phone_number}</Link>
        </Typography>
        <Typography level="body-sm">
          Joined: {dateAdded?.split('T')[0]}
        </Typography>
      </div>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">Total Points:</Typography>
          <Typography fontSize="lg" fontWeight="lg">
            {points}
          </Typography>
        </div>
        <Button
          variant="solid"
          size="md"
          color="primary"
          sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
        >
          Modify
        </Button>
      </CardContent>
    </Card>
  )
}

export default SkaterCard
