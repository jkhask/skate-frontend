import { zodResolver } from '@hookform/resolvers/zod'
import {
  Email,
  Favorite,
  InfoOutlined,
  Person,
  Phone,
  Scoreboard,
} from '@mui/icons-material'
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Stack,
  Typography,
} from '@mui/joy'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Skater } from '../API'
import { updateSkater } from '../services/skaters'

interface EditSkaterModalProps {
  skater: Skater
  open: boolean
  onClose: () => void
  onUpdateSkater: (skater: Skater) => void
}

const editSchema = z.object({
  email: z.string().email({ message: 'Must be a valid email.' }),
  name: z.string(),
  primary: z.string(),
  phone_number: z
    .string()
    .regex(
      new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
      'Invalid phone number.'
    )
    .length(10, { message: 'Must be 10 numbers.' }),
  points: z.coerce.number(),
})

type EditSchema = z.infer<typeof editSchema>

const EditSkaterModal: React.FC<EditSkaterModalProps> = ({
  skater,
  open,
  onClose,
  onUpdateSkater,
}) => {
  const { sub, name, email, phone_number, primary, points } = skater

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditSchema>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      email: email!,
      name: name!,
      primary: primary!,
      phone_number: phone_number!.slice(2),
      points: points!,
    },
  })
  return (
    <Modal {...{ open, onClose }}>
      <ModalDialog>
        <ModalClose />
        <Typography component="h2" level="h4" fontWeight="lg" mb={1}>
          Edit skater
        </Typography>
        <form
          onSubmit={handleSubmit(async formData => {
            const updatedSkater = await updateSkater({
              sub: sub!,
              ...formData,
              phone_number: `+1${formData.phone_number}`,
            })
            onUpdateSkater(updatedSkater!)
            onClose()
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
            <FormControl
              error={!!errors.primary}
              {...register('primary')}
              defaultValue={primary!}
            >
              <Select
                placeholder="Primary"
                startDecorator={<Favorite />}
                required
                defaultValue={primary}
              >
                <Option value="quads">Quads</Option>
                <Option value="inline">Inline</Option>
                <Option value="board">Board</Option>
              </Select>
            </FormControl>
            <FormControl error={!!errors.points}>
              <Input
                {...register('points')}
                placeholder="Points"
                startDecorator={<Scoreboard />}
                type="number"
                required
              />
              {!!errors.points && (
                <FormHelperText>
                  <InfoOutlined />
                  {errors.points?.message}
                </FormHelperText>
              )}
            </FormControl>
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
}

export default EditSkaterModal
