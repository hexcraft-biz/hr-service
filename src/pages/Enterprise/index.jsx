import BackupIcon from '@mui/icons-material/Backup'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import { chain, get, has, includes, isNull, keys, transform } from 'lodash'
import { useSnackbar } from 'notistack'
import { Fragment, useCallback, useEffect, useState } from 'react'
import sleep from '../../helpers/sleep'
import TimeRange from '../../components/TimeRange'

const WEEK = [
  { key: 'SUN', label: '週日' },
  { key: 'MON', label: '週一' },
  { key: 'TUE', label: '週二' },
  { key: 'WED', label: '週三' },
  { key: 'THU', label: '週四' },
  { key: 'FRI', label: '週五' },
  { key: 'SAT', label: '週六' },
]

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.sm,
  '&, &.Mui-expanded': {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))

const WorkdayCard = ({ config, setConfig, expanded, handleExpended }) => {
  const workdays = get(config, 'workdays', [{}])

  const handleChange = event => {
    let newCycle = event.target.value
    if (newCycle === 'weekly') {
      setConfig(c => ({ ...c, workdays: [c.workdays[0]] }))
    } else if (newCycle === 'biweekly') {
      setConfig(c => ({ ...c, workdays: [c.workdays[0], c.workdays[0]] }))
    }
  }

  const handleCheck = (i, day) => event => {
    setConfig(c => {
      let result = c
      if (event.target.checked) {
        result = {
          ...c,
          workdays: [
            ...c.workdays.slice(0, i),
            {
              ...c.workdays[i],
              [day]: {
                shift: {
                  start: null,
                  end: null,
                },
                break: {
                  start: null,
                  end: null,
                },
              },
            },
            ...c.workdays.slice(i + 1),
          ],
        }
      } else {
        result = {
          ...c,
          workdays: [
            ...c.workdays.slice(0, i),
            { ...chain(c.workdays[i]).omit(day).value() },
            ...c.workdays.slice(i + 1),
          ],
        }
      }
      return result
    })
  }

  return (
    <StyledAccordion
      component={Paper}
      expanded={expanded === 'workday'}
      onChange={handleExpended('workday')}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='workday-content'
        id='workday-header'
      >
        <Typography>設定工作日</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl size='small'>
          <FormLabel id='cycle-group'>週期</FormLabel>
          <RadioGroup
            row
            aria-labelledby='cycle-group'
            name='cycle-group'
            value={
              chain(config).get('workdays', []).size().value() > 1
                ? 'biweekly'
                : 'weekly'
            }
            onChange={handleChange}
          >
            <FormControlLabel
              value='weekly'
              control={<Radio size='small' />}
              label='單週重複'
            />
            <FormControlLabel
              value='biweekly'
              control={<Radio size='small' />}
              label='隔週循環'
            />
          </RadioGroup>
        </FormControl>
        {workdays.map((week, i) => (
          <Fragment key={i}>
            <Divider sx={{ my: 1.5 }} />
            <FormGroup row>
              <FormLabel component='legend' sx={{ width: '100%' }}>
                {i ? '雙週' : '單週'}
              </FormLabel>
              {WEEK.map(({ key, label }) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={chain(week).keys().includes(key).value()}
                      onChange={handleCheck(i, key)}
                    />
                  }
                  label={label}
                />
              ))}
            </FormGroup>
          </Fragment>
        ))}
      </AccordionDetails>
    </StyledAccordion>
  )
}

const ShiftCard = ({ config, setConfig, expanded, handleExpended }) => {
  const [range, setRange] = useState({ start: null, end: null })

  const workdays = get(config, 'workdays', [{}])

  const handleRange = (position, timeString) => {
    let key
    if (position === 'from') {
      key = 'start'
    } else if (position === 'to') {
      key = 'end'
    }
    setRange(r => ({
      ...r,
      [key]: timeString,
    }))
  }

  const applyToAll = () => {
    setConfig(c => ({
      ...c,
      workdays: c.workdays.map(week =>
        transform(
          week,
          (result, value, key) => {
            result[key] = {
              ...value,
              shift: {
                start: range.start,
                end: range.end,
              },
            }
          },
          {}
        )
      ),
    }))
  }

  const handleChange = (i, day) => (position, timeString) => {
    let key
    if (position === 'from') {
      key = 'start'
    } else if (position === 'to') {
      key = 'end'
    }
    setConfig(c => ({
      ...c,
      workdays: [
        ...c.workdays.slice(0, i),
        {
          ...c.workdays[i],
          [day]: {
            ...c.workdays[i][day],
            shift: {
              ...c.workdays[i][day].shift,
              [key]: timeString,
            },
          },
        },
        ...c.workdays.slice(i + 1),
      ],
    }))
  }

  return (
    <StyledAccordion
      component={Paper}
      expanded={expanded === 'shift'}
      onChange={handleExpended('shift')}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='shift-content'
        id='shift-header'
      >
        <Typography>設定工作時間</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container alignItems='center' spacing={2}>
          <Grid item>
            <TimeRange
              from={range.start}
              to={range.end}
              onChange={handleRange}
            />
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              size='small'
              color='secondary'
              onClick={applyToAll}
            >
              全部套用
            </Button>
          </Grid>
        </Grid>
        {workdays.map((week, i) => (
          <Fragment key={i}>
            <Divider sx={{ my: 1.5 }} />
            <FormGroup>
              <Grid container direction='column' spacing={1.5}>
                <Grid item>
                  <FormLabel
                    component='legend'
                    sx={{ width: '100%', fontSize: '0.6rem' }}
                  >
                    {i ? '雙週' : '單週'}
                  </FormLabel>
                </Grid>
                {WEEK.map(
                  ({ key, label }) =>
                    has(week, key) && (
                      <Grid item key={key}>
                        <Grid
                          container
                          alignItems='center'
                          spacing={{ xs: 1, sm: 2 }}
                        >
                          <Grid item xs={12} sm='auto'>
                            <Typography fontSize='0.6rem'>
                              {chain(WEEK)
                                .find(x => x.key === key)
                                .get('label')
                                .value()}
                              ：
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm>
                            <TimeRange
                              small
                              from={week[key].shift.start}
                              to={week[key].shift.end}
                              onChange={handleChange(i, key)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    )
                )}
              </Grid>
            </FormGroup>
          </Fragment>
        ))}
      </AccordionDetails>
    </StyledAccordion>
  )
}

const BreakCard = ({ config, setConfig, expanded, handleExpended }) => {
  const [range, setRange] = useState({ start: null, end: null })

  const workdays = get(config, 'workdays', [{}])

  const handleRange = (position, timeString) => {
    let key
    if (position === 'from') {
      key = 'start'
    } else if (position === 'to') {
      key = 'end'
    }
    setRange(r => ({
      ...r,
      [key]: timeString,
    }))
  }

  const applyToAll = () => {
    setConfig(c => ({
      ...c,
      workdays: c.workdays.map(week =>
        transform(
          week,
          (result, value, key) => {
            result[key] = {
              ...value,
              break: {
                start: range.start,
                end: range.end,
              },
            }
          },
          {}
        )
      ),
    }))
  }

  const handleChange = (i, day) => (position, timeString) => {
    let key
    if (position === 'from') {
      key = 'start'
    } else if (position === 'to') {
      key = 'end'
    }
    setConfig(c => ({
      ...c,
      workdays: [
        ...c.workdays.slice(0, i),
        {
          ...c.workdays[i],
          [day]: {
            ...c.workdays[i][day],
            break: {
              ...c.workdays[i][day].break,
              [key]: timeString,
            },
          },
        },
        ...c.workdays.slice(i + 1),
      ],
    }))
  }

  return (
    <StyledAccordion
      component={Paper}
      expanded={expanded === 'break'}
      onChange={handleExpended('break')}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='break-content'
        id='break-header'
      >
        <Typography>設定休息時間</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container alignItems='center' spacing={2}>
          <Grid item>
            <TimeRange
              from={range.start}
              to={range.end}
              onChange={handleRange}
            />
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              size='small'
              color='secondary'
              onClick={applyToAll}
            >
              全部套用
            </Button>
          </Grid>
        </Grid>
        {workdays.map((week, i) => (
          <Fragment key={i}>
            <Divider sx={{ my: 1.5 }} />
            <FormGroup>
              <Grid container direction='column' spacing={1.5}>
                <Grid item>
                  <FormLabel
                    component='legend'
                    sx={{ width: '100%', fontSize: '0.6rem' }}
                  >
                    {i ? '雙週' : '單週'}
                  </FormLabel>
                </Grid>
                {WEEK.map(
                  ({ key, label }) =>
                    has(week, key) && (
                      <Grid item key={key}>
                        <Grid
                          container
                          alignItems='center'
                          spacing={{ xs: 1, sm: 2 }}
                        >
                          <Grid item xs={12} sm='auto'>
                            <Typography fontSize='0.6rem'>
                              {chain(WEEK)
                                .find(x => x.key === key)
                                .get('label')
                                .value()}
                              ：
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm>
                            <TimeRange
                              small
                              from={week[key].break.start}
                              to={week[key].break.end}
                              onChange={handleChange(i, key)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    )
                )}
              </Grid>
            </FormGroup>
          </Fragment>
        ))}
      </AccordionDetails>
    </StyledAccordion>
  )
}

const MakeUpCard = ({ config, setConfig, expanded, handleExpended }) => {
  const handleChange = event => {
    let newMode = event.target.value
    setConfig(c => ({ ...c, makeUp: { ...c.makeUp, mode: newMode } }))
  }

  const handleSelect = event => {
    setConfig(c => ({
      ...c,
      makeUp: {
        ...c.makeUp,
        day: event.target.value,
      },
    }))
  }

  const handleRange = key => (position, timeString) => {
    let timeKey
    if (position === 'from') {
      timeKey = 'start'
    } else if (position === 'to') {
      timeKey = 'end'
    }
    setConfig(c => ({
      ...c,
      makeUp: {
        ...c.makeUp,
        [key]: {
          ...c.makeUp[key],
          [timeKey]: timeString,
        },
      },
    }))
  }

  const repeatedDays = chain(config)
    .get('workdays', [])
    .map(week => keys(week))
    .flatten()
    .filter((value, idx, arr) => includes(arr, value, idx + 1))
    .value()

  return (
    <StyledAccordion
      component={Paper}
      expanded={expanded === 'makeUp'}
      onChange={handleExpended('makeUp')}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='make-up-content'
        id='make-up-header'
      >
        <Typography>設定補班</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl size='small'>
          <RadioGroup
            row
            name='mode-group'
            value={get(config, ['makeUp', 'mode'], 'none')}
            onChange={handleChange}
          >
            <FormControlLabel
              value='none'
              control={<Radio size='small' />}
              label='不補班'
            />
            <FormControlLabel
              value='advance'
              control={<Radio size='small' />}
              label='提前補單'
            />
            <FormControlLabel
              value='postpone'
              control={<Radio size='small' />}
              label='延後補班'
            />
          </RadioGroup>
        </FormControl>
        {get(config, ['makeUp', 'mode'], 'none') !== 'none' && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Grid
              container
              direction='column'
              alignItems='flex-start'
              spacing={2}
            >
              <Grid item>
                <FormControl size='small' sx={{ width: { xs: 120, sm: 150 } }}>
                  <InputLabel id='make-up-day'>補班日</InputLabel>
                  <Select
                    labelId='make-up-day'
                    value={
                      includes(repeatedDays, get(config, ['makeUp', 'day'], ''))
                        ? ''
                        : get(config, ['makeUp', 'day'], '')
                    }
                    label='補班日'
                    onChange={handleSelect}
                  >
                    <MenuItem value='' disabled>
                      <em>None</em>
                    </MenuItem>
                    {WEEK.map(
                      ({ key, label }) =>
                        !includes(repeatedDays, key) && (
                          <MenuItem value={key} key={key}>
                            {label}
                          </MenuItem>
                        )
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Grid container alignItems='center' spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12} sm='auto'>
                    <Typography>工作時間：</Typography>
                  </Grid>
                  <Grid item xs={12} sm>
                    <TimeRange
                      from={get(config, ['makeUp', 'shift', 'start'], null)}
                      to={get(config, ['makeUp', 'shift', 'end'], null)}
                      onChange={handleRange('shift')}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems='center' spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12} sm='auto'>
                    <Typography>休息時間：</Typography>
                  </Grid>
                  <Grid item xs={12} sm>
                    <TimeRange
                      from={get(config, ['makeUp', 'break', 'start'], null)}
                      to={get(config, ['makeUp', 'break', 'end'], null)}
                      onChange={handleRange('break')}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </AccordionDetails>
    </StyledAccordion>
  )
}

const Enterprise = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [expanded, setExpanded] = useState('workday')
  const [config, setConfig] = useState(null)

  const handleExpended = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const fetchConfig = useCallback(() => {
    setConfig(null)
    sleep(500).then(() => {
      let data = {
        workdays: [
          {
            MON: {
              shift: { start: '08:00', end: '18:00' },
              break: { start: '12:00', end: '13:00' },
            },
            TUE: {
              shift: { start: '08:00', end: '18:00' },
              break: { start: '12:00', end: '13:00' },
            },
          },
          {
            THU: {
              shift: { start: '10:00', end: '20:00' },
              break: { start: '14:00', end: '15:00' },
            },
            FRI: {
              shift: { start: '10:00', end: '20:00' },
              break: { start: '14:00', end: '15:00' },
            },
          },
        ],
        makeUp: {
          mode: 'advance',
          day: 'SAT',
          shift: { start: '10:00', end: '20:00' },
          break: { start: '14:00', end: '15:00' },
        },
      }
      setConfig(data)
    })
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const isWorkdayCompleted =
    chain(config).get('workdays', []).size().gt(0).value() &&
    !chain(config)
      .get('workdays', [])
      .map(x => chain(x).keys().size().value())
      .includes(0)
      .value()

  const isShiftCompleted =
    isWorkdayCompleted &&
    !chain(config)
      .get('workdays', [])
      .map(week =>
        chain(week)
          .values()
          .map(day => [
            get(day, ['shift', 'start'], null),
            get(day, ['shift', 'end'], null),
          ])
          .value()
      )
      .flattenDeep()
      .some(x => includes([null, '', 'Invalid Date'], x))
      .value()

  const isBreakCompleted =
    isWorkdayCompleted &&
    !chain(config)
      .get('workdays', [])
      .map(week =>
        chain(week)
          .values()
          .map(day => [
            get(day, ['break', 'start'], null),
            get(day, ['break', 'end'], null),
          ])
          .value()
      )
      .flattenDeep()
      .some(x => includes([null, '', 'Invalid Date'], x))
      .value()

  const isMakeUpCompleted =
    get(config, ['makeUp', 'mode']) === 'none' ||
    (isWorkdayCompleted &&
      !chain(config)
        .get('workdays', [])
        .map(week => keys(week))
        .flatten()
        .filter((value, idx, arr) => includes(arr, value, idx + 1))
        .includes(get(config, ['makeUp', 'day'], ''))
        .value() &&
      !chain(config)
        .get(['makeUp', 'break'])
        .values()
        .concat(chain(config).get(['makeUp', 'shift']).values().value())
        .flatten()
        .some(x => includes([null, '', 'Invalid Date'], x))
        .value())

  const handleUpdate = async () => {
    console.log('config', config)
    await sleep(500).then(() => {
      enqueueSnackbar('排班設定已更新', { variant: 'success' })
    })
    fetchConfig()
  }

  return (
    <>
      <Stepper activeStep={0} alternativeLabel sx={{ px: 1, py: 1.5 }}>
        <Step completed={isWorkdayCompleted}>
          <StepLabel>工作日</StepLabel>
        </Step>
        <Step completed={isShiftCompleted}>
          <StepLabel>工作時間</StepLabel>
        </Step>
        <Step completed={isBreakCompleted}>
          <StepLabel>休息時間</StepLabel>
        </Step>
        <Step completed={isMakeUpCompleted}>
          <StepLabel>補班</StepLabel>
        </Step>
      </Stepper>
      <Grid container direction='column' spacing={2.5}>
        <Grid item></Grid>
        {isNull(config) ? (
          <Grid item align='center'>
            <Box py={12}>
              <CircularProgress size={80} thickness={1.8} />
            </Box>
          </Grid>
        ) : (
          <>
            <Grid item>
              <WorkdayCard
                {...{ config, setConfig, expanded, handleExpended }}
              />
              <ShiftCard {...{ config, setConfig, expanded, handleExpended }} />
              <BreakCard {...{ config, setConfig, expanded, handleExpended }} />
              <MakeUpCard
                {...{ config, setConfig, expanded, handleExpended }}
              />
            </Grid>
            <Grid item>
              <Box
                sx={theme => ({
                  width: '100%',
                  maxWidth: theme.breakpoints.values.sm,
                  mx: 'auto',
                })}
              >
                <Button
                  variant='contained'
                  startIcon={<BackupIcon />}
                  disabled={
                    !(
                      isWorkdayCompleted &&
                      isShiftCompleted &&
                      isBreakCompleted &&
                      isMakeUpCompleted
                    )
                  }
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </>
  )
}

export default Enterprise
