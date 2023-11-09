import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MuiLink from '@mui/material/Link'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { isArray, map } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { Link, generatePath } from 'react-router-dom'
import sleep from '../../../../helpers/sleep'

const PunchedList = ({ open, onClose }) => {
  const [rows, setRows] = useState(null)

  const fetch = useCallback(() => {
    sleep(300).then(() => {
      setRows([])
    })
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  let createRows = <></>

  if (!isArray(rows)) {
    createRows = map(Array(3), (_x, i) => (
      <TableRow
        key={i}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component='th' scope='row'>
          <Skeleton variant='text' width='80%' />
        </TableCell>
        <TableCell>
          <Skeleton variant='text' width='80%' />
        </TableCell>
        <TableCell>
          <Skeleton variant='text' width='80%' />
        </TableCell>
      </TableRow>
    ))
  } else if (rows.length > 0) {
    createRows = map(rows, ({ firstName, lastName, employeeId }) => (
      <TableRow
        key={employeeId}
        hover
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component='th' scope='row'>
          {firstName}
        </TableCell>
        <TableCell>{lastName}</TableCell>
        <TableCell>
          <MuiLink
            component={Link}
            to={generatePath('/employees/:id/attendance', {
              id: employeeId,
            })}
          >
            Attendance
          </MuiLink>
        </TableCell>
      </TableRow>
    ))
  } else {
    createRows = (
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component='th' scope='row' colSpan={3} align='center'>
          <em style={{ opacity: 0.6 }}>No Result.</em>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Punched List</DialogTitle>
      <DialogContent dividers>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{createRows}</TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  )
}

export default PunchedList
