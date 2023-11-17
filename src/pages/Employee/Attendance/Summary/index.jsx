import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import { isNull } from 'lodash'
import { useCallback } from 'react'

const Summary = ({ summary }) => {
  const createCell = useCallback(
    key => {
      let cell = <></>
      if (isNull(summary)) {
        cell = <Skeleton variant='text' width={60} sx={{ ml: 'auto' }} />
      } else {
        cell = summary[key]
      }
      return cell
    },
    [summary]
  )

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TableContainer>
          <Typography sx={{ mt: 2, px: 2 }} variant='h6' component='div'>
            出勤
          </Typography>
          <Table>
            <TableBody>
              <TableRow
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  應出勤天數
                </TableCell>
                <TableCell align='right'>
                  {createCell('daysAttendanceRequired')}
                </TableCell>
              </TableRow>
              <TableRow
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  出勤天數
                </TableCell>
                <TableCell align='right'>
                  {createCell('daysAttendance')}
                </TableCell>
              </TableRow>
              <TableRow
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  曠職時數
                </TableCell>
                <TableCell align='right'>
                  {createCell('hoursAbsence')}
                </TableCell>
              </TableRow>
              <TableRow
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  紀錄修改天數
                </TableCell>
                <TableCell align='right'>
                  {createCell('daysModificated')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} sx={{ display: { md: 'none' } }} />
      <Grid item xs={12} md={6}>
        <TableContainer>
          <Typography sx={{ mt: 2, px: 2 }} variant='h6' component='div'>
            休假
          </Typography>
          <Table>
            <TableBody>
              <TableRow
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  特休
                </TableCell>
                <TableCell align='right'>{createCell('annualLeave')}</TableCell>
              </TableRow>
              <TableRow
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  事假
                </TableCell>
                <TableCell align='right'>
                  {createCell('personalLeave')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default Summary
