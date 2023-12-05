import { styled } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import { isNull } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import sleep from '../../helpers/sleep'
import UnpunchedList from './components/Unpunched List'
import PunchedList from './components/PunchedList'
import LeaveList from './components/LeaveList'

const StyledBox = styled(Box)({
  display: 'block',
  padding: 16,
  alignItems: 'unset',
  justifyContent: 'unset',
  textTransform: 'inherit',
  letterSpacing: 'unset',
  verticalAlign: 'unset',
  color: 'inherit',
  textAlign: 'left',
  width: '100%',
})

const ButtonBox = ({ title, value, path, onClick = null }) => (
  <StyledBox
    component={Button}
    onClick={onClick}
    sx={{ ...(!onClick && { pointerEvents: 'none' }) }}
  >
    <Typography variant='subtitle1'>{title}</Typography>
    <Typography variant='body1' fontSize='2.4rem'>
      {isNull(value) ? <Skeleton variant='text' width='80%' /> : value}
    </Typography>
  </StyledBox>
)

const Root = () => {
  const [value, setValue] = useState({
    tea: null,
    pi: null,
    npi: null,
    leave: null,
  })
  const [open, setOpen] = useState({
    pi: false,
    npi: false,
    leave: false,
  })

  const fetchTea = useCallback(() => {
    sleep(300).then(() => {
      setValue(v => ({
        ...v,
        tea: 3,
      }))
    })
  }, [])

  const fetchPi = useCallback(() => {
    sleep(500).then(() => {
      setValue(v => ({
        ...v,
        pi: 0,
      }))
    })
  }, [])

  const fetchNpi = useCallback(() => {
    sleep(700).then(() => {
      setValue(v => ({
        ...v,
        npi: 3,
      }))
    })
  }, [])

  const fetchLeave = useCallback(() => {
    sleep(900).then(() => {
      setValue(v => ({
        ...v,
        leave: 0,
      }))
    })
  }, [])

  const fetchAll = useCallback(() => {
    fetchTea()
    fetchPi()
    fetchNpi()
    fetchLeave()
  }, [fetchTea, fetchPi, fetchNpi, fetchLeave])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleClose = () => {
    setOpen({
      pi: false,
      npi: false,
      leave: false,
    })
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader title='Daily Attendance' sx={{ pb: 0 }} />
      <CardActions>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <ButtonBox title='Total Employee Amount' value={value.tea} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ButtonBox
              title='Punched In'
              value={value.pi}
              onClick={() => setOpen(o => ({ ...o, pi: true }))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ButtonBox
              title='Not Punched In'
              value={value.npi}
              onClick={() => setOpen(o => ({ ...o, npi: true }))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ButtonBox
              title='Leave'
              value={value.leave}
              onClick={() => setOpen(o => ({ ...o, leave: true }))}
            />
          </Grid>
        </Grid>
        {open.pi && <PunchedList open={open.pi} onClose={handleClose} />}
        {open.npi && <UnpunchedList open={open.npi} onClose={handleClose} />}
        {open.leave && <LeaveList open={open.leave} onClose={handleClose} />}
      </CardActions>
    </Card>
  )
}

export default Root
