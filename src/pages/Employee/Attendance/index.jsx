import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import dayjs from 'dayjs'
import { isNull } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import sleep from '../../../helpers/sleep'
import Summary from './Summary'
import Daily from './Daily'
import PunchedRecords from './PunchedRecords'

const Attendance = () => {
  const { id } = useParams()
  const [tab, setTab] = useState('summary')
  const [profile, setProfile] = useState(null)
  const [date, setDate] = useState(dayjs(Date.now()))
  const [summary, setSummary] = useState(null)
  const [daily, setDaily] = useState(null)
  const [punchedRecords, setPunchedRecords] = useState(null)

  const handleChange = (_event, newValue) => {
    setTab(newValue)
  }

  const fetchProfile = useCallback(id => {
    sleep(500).then(() =>
      setProfile({
        id,
        firstName: 'John',
        lastName: 'Li',
      })
    )
  }, [])

  useEffect(() => {
    fetchProfile(id)
  }, [id, fetchProfile])

  const fetchSummary = useCallback((id, date) => {
    setSummary(null)
    sleep(500).then(() =>
      setSummary({
        daysAttendanceRequired: 0,
        daysAttendance: 0,
        hoursAbsence: 0,
        daysModificated: 0,
        annualLeave: 0,
        personalLeave: 0,
      })
    )
  }, [])

  const fetchDaily = useCallback((id, date) => {
    setDaily(null)
    sleep(500).then(() =>
      setDaily([
        {
          date: '2023-11-11',
          modified: false,
          workEarly: false,
          overtime: false,
          defaultWorkTime: 8,
          totalWorkTime: 12,
          generalWorkTime: 8,
          breakTime: 2,
          leaveTime: 1,
          absenceTime: 3,
        },
        {
          date: '2023-11-12',
          modified: true,
          workEarly: true,
          overtime: false,
          defaultWorkTime: 7,
          totalWorkTime: 15,
          generalWorkTime: 9,
          breakTime: 4,
          leaveTime: 2,
          absenceTime: 1,
        },
        {
          date: '2023-11-13',
          modified: false,
          workEarly: false,
          overtime: true,
          defaultWorkTime: 5,
          totalWorkTime: 7,
          generalWorkTime: 3,
          breakTime: 0,
          leaveTime: 1,
          absenceTime: 6,
        },
      ])
    )
  }, [])

  const fetchPunchedRecords = useCallback((id, date) => {
    setPunchedRecords(null)
    sleep(500).then(() =>
      setPunchedRecords([
        {
          id: '1',
          type: 'MODIFIED',
          date: '2023-11-08',
          time: '20:32:30',
        },
        {
          id: '2',
          type: 'MODIFIED',
          date: '2023-11-10',
          time: '08:30:30',
        },
        {
          id: '3',
          type: 'MODIFIED',
          date: '2023-11-10',
          time: '18:30:30',
        },
      ])
    )
  }, [])

  const fetchAll = useCallback(
    (id, date) => {
      fetchSummary(id, date)
      fetchDaily(id, date)
      fetchPunchedRecords(id, date)
    },
    [fetchSummary, fetchDaily, fetchPunchedRecords]
  )

  useEffect(() => {
    fetchAll(id, date)
  }, [id, date, fetchAll])

  return (
    <Paper>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar
            sx={{
              pt: 2,
              pb: 1,
              pl: { sm: 2 },
              pr: { sm: 4 },
            }}
          >
            <Grid
              container
              justifyContent='space-between'
              alignItems='flex-end'
              spacing={1}
            >
              <Grid xs={12} sm item>
                <Typography
                  sx={{ flex: '1 1 100%' }}
                  variant='h6'
                  component='div'
                >
                  Employee:{' '}
                  {isNull(profile) ? (
                    <Skeleton
                      variant='text'
                      width={160}
                      sx={{ display: 'inline-block' }}
                    />
                  ) : (
                    `${profile.firstName} ${profile.lastName}`
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} sm='auto' textAlign='right'>
                <DatePicker
                  label=''
                  value={date}
                  views={['month', 'year']}
                  slotProps={{
                    textField: { variant: 'standard' },
                  }}
                  onChange={newValue => setDate(newValue || dayjs(Date.now()))}
                />
              </Grid>
            </Grid>
          </Toolbar>
          <TabList onChange={handleChange}>
            <Tab
              label='Summary'
              value='summary'
              sx={{ letterSpacing: '1px' }}
            />
            <Tab label='Daily' value='daily' sx={{ letterSpacing: '1px' }} />
            <Tab
              label='Punched Records'
              value='punched-records'
              sx={{ letterSpacing: '1px' }}
            />
          </TabList>
        </Box>
        <TabPanel value='summary'>
          <Summary summary={summary} />
        </TabPanel>
        <TabPanel value='daily'>
          <Daily daily={daily} />
        </TabPanel>
        <TabPanel value='punched-records'>
          <PunchedRecords punchedRecords={punchedRecords} refresh={fetchAll} />
        </TabPanel>
      </TabContext>
    </Paper>
  )
}

export default Attendance
