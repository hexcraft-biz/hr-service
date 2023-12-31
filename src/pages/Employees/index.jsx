import MuiLink from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { chain, isArray, map } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, generatePath } from 'react-router-dom'
import sleep from '../../helpers/sleep'
import Search from '../../components/Search'

const Employees = () => {
  const [employees, setEmployees] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [keyword, setKeyword] = useState('')

  const fetch = useCallback(() => {
    sleep(300).then(() =>
      setEmployees([
        {
          firstName: 'John',
          lastName: 'Li',
          id: '0150438b-85e4-4a5a-bae5-47a54c33d82e',
        },
        {
          firstName: 'Frank',
          lastName: 'Renn',
          id: '4d404df7-74d0-492c-8c66-cbf984a6a89d',
        },
        {
          firstName: 'Keira',
          lastName: 'Ko',
          id: '61730286-165b-4c8e-b7da-de6601d11536',
        },
      ])
    )
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  const handleChangeKeyword = value => {
    setPage(0)
    setKeyword(value)
  }

  const handleChangePage = (_event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const visibleRows = useMemo(
    () =>
      chain(employees)
        .filter(
          ({ firstName, lastName }) =>
            firstName.toLowerCase().includes(keyword.toLowerCase()) ||
            lastName.toLowerCase().includes(keyword.toLowerCase())
        )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .value(),
    [keyword, employees, page, rowsPerPage]
  )

  let createRows = <></>

  if (!isArray(employees)) {
    createRows = map(Array(5), (_x, i) => (
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
        <TableCell>
          <Skeleton variant='text' width='80%' />
        </TableCell>
      </TableRow>
    ))
  } else if (visibleRows.length > 0) {
    createRows = map(visibleRows, ({ firstName, lastName, id }) => (
      <TableRow
        key={id}
        hover
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component='th' scope='row'>
          {firstName}
        </TableCell>
        <TableCell>{lastName}</TableCell>
        <TableCell>
          <MuiLink component={Link} to={generatePath('/employees/:id', { id })}>
            Basic Info
          </MuiLink>
        </TableCell>
        <TableCell>
          <MuiLink
            component={Link}
            to={generatePath('/employees/:id/attendance', { id })}
          >
            Attendance
          </MuiLink>
        </TableCell>
      </TableRow>
    ))
  } else {
    createRows = (
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component='th' scope='row' colSpan={4} align='center'>
          <em style={{ opacity: 0.6 }}>No Result.</em>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Typography sx={{ flex: '1 1 100%' }} variant='h6' component='div'>
          Employees
        </Typography>
        <Search
          onChange={handleChangeKeyword}
          sx={theme => ({
            marginLeft: 0,
            [theme.breakpoints.up('sm')]: {
              marginLeft: theme.spacing(1),
              width: 'auto',
            },
          })}
        />
      </Toolbar>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Basic Info</TableCell>
            <TableCell>Attendance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{createRows}</TableBody>
      </Table>
      {isArray(employees) && (
        <TablePagination
          component='div'
          rowsPerPageOptions={[5, 10, 25]}
          count={employees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </TableContainer>
  )
}

export default Employees
