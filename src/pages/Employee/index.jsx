import CommitIcon from '@mui/icons-material/Commit'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SendIcon from '@mui/icons-material/Send'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import UsbIcon from '@mui/icons-material/Usb'
import UsbOffIcon from '@mui/icons-material/UsbOff'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import LoadingButton from '@mui/lab/LoadingButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField'

import dayjs from 'dayjs'
import { isNull } from 'lodash'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import sleep from '../../helpers/sleep'
import ContainedIconButton from '../../components/ContainedIconButton'
import OutlinedIconButton from '../../components/OutlinedIconButton'
import { CARD_READER_URI } from '../../constants'

const BasicInfo = ({ id }) => {
  const [profile, setProfile] = useState(null)
  const [readOnly, setReadOnly] = useState(true)
  const fetchRef = useRef(null)

  const fetch = useCallback(id => {
    sleep(500).then(() => {
      const data = {
        id,
        firstName: 'John',
        lastName: 'Li',
        birthDate: '1990-01-01',
        gender: 'male',
        marital: 'single',
        nationality: 'TWN',
        status: 'employed',
        startDate: '2023-09-22',
        endDate: '',
        modifiedAt: '2023-09-22 18:17:34',
        createdAt: '2023-09-22 17:19:10',
      }
      fetchRef.current = data
      setProfile(data)
    })
  }, [])

  useEffect(() => {
    fetch(id)
  }, [id, fetch])

  const handleChange = (key, value) => setProfile(p => ({ ...p, [key]: value }))

  const submit = () => {
    setProfile(null)
    fetch()
  }

  const handleReset = () => {
    setReadOnly(true)
    setProfile(fetchRef.current)
  }

  const handleSubmit = () => {
    setReadOnly(true)
    submit()
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={6} sm={4}>
        {isNull(profile) ? (
          <Skeleton variant='text' height={48} />
        ) : (
          <TextField
            id='first-name'
            label='First name'
            variant='standard'
            value={profile.firstName}
            fullWidth
            inputProps={{ readOnly }}
            onChange={e => handleChange('firstName', e.target.value)}
          />
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        {isNull(profile) ? (
          <Skeleton variant='text' height={48} />
        ) : (
          <TextField
            id='last-name'
            label='Last name'
            variant='standard'
            value={profile.lastName}
            fullWidth
            inputProps={{ readOnly }}
            onChange={e => handleChange('lastName', e.target.value)}
          />
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        {isNull(profile) ? (
          <Skeleton variant='text' height={48} />
        ) : (
          <DatePicker
            label='Birth Date'
            value={
              Boolean(profile.birthDate) ? dayjs(profile.birthDate) : undefined
            }
            readOnly={readOnly}
            slotProps={{
              textField: { variant: 'standard', fullWidth: true },
            }}
            onChange={newValue => handleChange('birthDate', newValue)}
          />
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        {isNull(profile) ? (
          <Skeleton variant='text' height={48} />
        ) : (
          <FormControl variant='standard' fullWidth>
            <InputLabel id='gender-label'>Gender</InputLabel>
            <Select
              labelId='gender-label'
              id='gender'
              value={profile.gender}
              label='Gender'
              inputProps={{ readOnly }}
              onChange={e => handleChange('gender', e.target.value)}
            >
              <MenuItem value='male'>Male</MenuItem>
              <MenuItem value='female'>Female</MenuItem>
            </Select>
          </FormControl>
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        {isNull(profile) ? (
          <Skeleton variant='text' height={48} />
        ) : (
          <FormControl variant='standard' fullWidth>
            <InputLabel id='marital-label'>Marital</InputLabel>
            <Select
              labelId='marital-label'
              id='marital'
              value={profile.marital}
              label='Marital'
              inputProps={{ readOnly }}
              onChange={e => handleChange('marital', e.target.value)}
            >
              <MenuItem value='single'>Single</MenuItem>
              <MenuItem value='married'>Married</MenuItem>
            </Select>
          </FormControl>
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        {isNull(profile) ? (
          <Skeleton variant='text' height={48} />
        ) : (
          <FormControl variant='standard' fullWidth>
            <InputLabel id='nationality-label'>Nationality</InputLabel>
            <Select
              labelId='nationality-label'
              id='nationality'
              value={profile.nationality}
              label='Nationality'
              inputProps={{ readOnly }}
              onChange={e => handleChange('nationality', e.target.value)}
            >
              <MenuItem value='CHN'>China</MenuItem>
              <MenuItem value='HKG'>Hong Kong</MenuItem>
              <MenuItem value='IDN'>Indonesia</MenuItem>
              <MenuItem value='MAC'>Macau</MenuItem>
              <MenuItem value='PHL'>Philippines</MenuItem>
              <MenuItem value='TWN'>Taiwan</MenuItem>
              <MenuItem value='VNM'>Vietnam</MenuItem>
            </Select>
          </FormControl>
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        {isNull(profile) ? (
          <Skeleton variant='text' height={48} />
        ) : (
          <FormControl variant='standard' fullWidth>
            <InputLabel id='status-label'>Status</InputLabel>
            <Select
              labelId='status-label'
              id='status'
              value={profile.status}
              label='Status'
              inputProps={{ readOnly }}
              onChange={e => handleChange('status', e.target.value)}
            >
              <MenuItem value='employed'>Employed</MenuItem>
              <MenuItem value='resigned'>Resigned</MenuItem>
              <MenuItem value='terminated'>Terminated</MenuItem>
              <MenuItem value='suspended'>Suspended</MenuItem>
            </Select>
          </FormControl>
        )}
      </Grid>
      <Grid item xs={6} sx={{ display: { sm: 'none' } }} />
      <Grid item xs={6} sm={4}>
        {isNull(profile) ? (
          <Skeleton variant='text' height={48} />
        ) : (
          <DatePicker
            label='Start Date'
            value={
              Boolean(profile.startDate) ? dayjs(profile.startDate) : undefined
            }
            readOnly={readOnly}
            slotProps={{
              textField: { variant: 'standard', fullWidth: true },
            }}
            onChange={newValue => handleChange('startDate', newValue)}
          />
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        {isNull(profile) ? (
          <Skeleton variant='text' height={48} />
        ) : (
          <DatePicker
            label='End Date'
            value={
              Boolean(profile.endDate) ? dayjs(profile.endDate) : undefined
            }
            readOnly={readOnly}
            slotProps={{
              textField: { variant: 'standard', fullWidth: true },
            }}
            onChange={newValue => handleChange('endDate', newValue)}
          />
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        {isNull(profile) ? (
          <Skeleton variant='text' height={48} />
        ) : (
          <DateTimeField
            label='Modified At'
            value={
              Boolean(profile.modifiedAt)
                ? dayjs(profile.modifiedAt)
                : undefined
            }
            readOnly
            disabled={!readOnly}
            slotProps={{
              textField: { variant: 'standard', fullWidth: true },
            }}
          />
        )}
      </Grid>
      <Grid item xs={6} sm={4}>
        {isNull(profile) ? (
          <Skeleton variant='text' height={48} />
        ) : (
          <DateTimeField
            label='Created At'
            value={
              Boolean(profile.createdAt) ? dayjs(profile.createdAt) : undefined
            }
            readOnly
            disabled={!readOnly}
            slotProps={{
              textField: { variant: 'standard', fullWidth: true },
            }}
          />
        )}
      </Grid>
      <Grid item xs sm={4}>
        <Stack
          direction='row'
          justifyContent='flex-end'
          alignItems='center'
          spacing={2}
          sx={{ height: '100%' }}
        >
          {readOnly ? (
            <ContainedIconButton
              color='secondary'
              size='large'
              onClick={() => setReadOnly(false)}
              disabled={isNull(profile)}
            >
              <EditIcon />
            </ContainedIconButton>
          ) : (
            <>
              <OutlinedIconButton
                color='primary'
                size='large'
                onClick={handleReset}
              >
                <RestartAltIcon />
              </OutlinedIconButton>
              <ContainedIconButton
                color='primary'
                size='large'
                onClick={handleSubmit}
              >
                <SendIcon />
              </ContainedIconButton>
            </>
          )}
        </Stack>
      </Grid>
    </Grid>
  )
}

const SUCKET_BUTTON_MAPPING = {
  disconnected: {
    color: 'primary',
    Icon: <UsbIcon />,
    contentText: 'Connect',
    loading: false,
    variant: 'contained',
  },
  connecting: {
    color: 'primary',
    Icon: <SettingsEthernetIcon />,
    contentText: 'Connecting',
    loading: true,
    variant: 'contained',
  },
  connected: {
    color: 'secondary',
    Icon: <UsbOffIcon />,
    contentText: 'Disconnect',
    loading: false,
    variant: 'outlined',
  },
}

const Card = ({ id }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [card, setCard] = useState(null)
  const [newCard, setNewCard] = useState('')
  const [open, setOpen] = useState(false)
  const [connectStatus, setConnectStatus] = useState('disconnected')
  const socketRef = useRef(null)

  const fetch = useCallback(id => {
    setCard(null)
    sleep(500).then(() =>
      setCard({
        uid: '',
        modifiedAt: '',
        createdAt: '',
      })
    )
  }, [])

  useEffect(() => {
    fetch(id)
  }, [id, fetch])

  const remove = () => {
    sleep(500).then(() => {
      enqueueSnackbar('Employee card has been removed.', { variant: 'info' })
      setOpen(false)
      fetch()
    })
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = () => {
    remove()
  }

  const connect = () => {
    setConnectStatus('connecting')

    socketRef.current = new WebSocket(CARD_READER_URI)

    socketRef.current.onopen = () => {
      console.log(`connected to ${CARD_READER_URI}`)
      setTimeout(() => {
        enqueueSnackbar('Connected to Card Reader.', {
          variant: 'success',
        })
        setConnectStatus('connected')
      }, 300)
    }

    socketRef.current.onclose = e => {
      console.log(`connection closed (${e.code})`)
      enqueueSnackbar('Card Reader Disonnected.', {
        variant: 'info',
      })
      setConnectStatus('disconnected')
      setNewCard('')
    }

    socketRef.current.onmessage = e => {
      console.log(`message received: ${e.data}`)
      enqueueSnackbar('Card Detected.', {
        variant: 'info',
      })
      setNewCard(e.data)
    }

    socketRef.current.onerror = e => {
      console.log('Error', e)
      enqueueSnackbar('Connect Card Reader Web Socket Server Fail.', {
        variant: 'error',
      })
    }
  }

  const disconnect = () => {
    socketRef.current.close(1000)
  }

  const handleSocket = () => {
    if (connectStatus === 'connected') {
      disconnect()
    } else {
      connect()
    }
  }

  const bind = () => {
    sleep(500).then(() => {
      enqueueSnackbar('New card has been bound successfully.', {
        variant: 'success',
      })
      fetch()
    })
  }

  const handleBind = () => {
    bind()
  }

  return (
    <>
      <Grid container spacing={3} alignItems='flex-end'>
        <Grid item xs={12} sm={4}>
          {isNull(card) ? (
            <Skeleton variant='text' height={48} />
          ) : (
            <TextField
              id='uid'
              label='UID'
              variant='standard'
              value={card.uid}
              fullWidth
              inputProps={{ readOnly: true }}
            />
          )}
        </Grid>
        <Grid item xs={6} sm={4}>
          {isNull(card) ? (
            <Skeleton variant='text' height={48} />
          ) : (
            <DateTimeField
              label='Modified At'
              value={
                Boolean(card.modifiedAt) ? dayjs(card.modifiedAt) : undefined
              }
              readOnly
              slotProps={{
                textField: { variant: 'standard', fullWidth: true },
              }}
            />
          )}
        </Grid>
        <Grid item xs={6} sm={4}>
          {isNull(card) ? (
            <Skeleton variant='text' height={48} />
          ) : (
            <DateTimeField
              label='Created At'
              value={
                Boolean(card.createdAt) ? dayjs(card.createdAt) : undefined
              }
              readOnly
              slotProps={{
                textField: { variant: 'standard', fullWidth: true },
              }}
            />
          )}
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'right' }}>
          <Button
            variant='outlined'
            color='error'
            size='large'
            startIcon={<DeleteIcon />}
            disabled={!Boolean(card?.uid)}
            onClick={() => setOpen(true)}
          >
            Delete
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this card?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} autoFocus>
                Cancel
              </Button>
              <Button color='error' variant='outlined' onClick={handleDelete}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
      <Divider sx={{ pt: 4 }}>New Card</Divider>
      <Grid container spacing={3} alignItems='flex-end'>
        <Grid item xs={12} sm={6}>
          {isNull(newCard) ? (
            <Skeleton variant='text' height={48} />
          ) : (
            <TextField
              id='new-uid'
              label='Detected UID'
              variant='standard'
              value={newCard}
              fullWidth
              inputProps={{ readOnly: true }}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction='row' justifyContent='flex-end' spacing={1}>
            <LoadingButton
              variant={SUCKET_BUTTON_MAPPING[connectStatus].variant}
              color={SUCKET_BUTTON_MAPPING[connectStatus].color}
              size='large'
              startIcon={SUCKET_BUTTON_MAPPING[connectStatus].Icon}
              onClick={handleSocket}
              loadingPosition='start'
              loading={SUCKET_BUTTON_MAPPING[connectStatus].loading}
            >
              {SUCKET_BUTTON_MAPPING[connectStatus].contentText}
            </LoadingButton>
            <Button
              variant='outlined'
              color='primary'
              size='large'
              disabled={!Boolean(newCard)}
              startIcon={<CommitIcon />}
              onClick={handleBind}
            >
              Setup
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

const Employee = () => {
  const { id } = useParams()
  const [tab, setTab] = useState('basicInfo')

  const handleChange = (_event, newValue) => {
    setTab(newValue)
  }

  return (
    <Paper>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange}>
              <Tab
                label='Basic Info'
                value='basicInfo'
                sx={{ letterSpacing: '1px' }}
              />
              <Tab label='Card' value='card' sx={{ letterSpacing: '1px' }} />
            </TabList>
          </Box>
          <TabPanel value='basicInfo'>
            <BasicInfo id={id} />
          </TabPanel>
          <TabPanel value='card'>
            <Card id={id} />
          </TabPanel>
        </TabContext>
      </LocalizationProvider>
    </Paper>
  )
}

export default Employee
