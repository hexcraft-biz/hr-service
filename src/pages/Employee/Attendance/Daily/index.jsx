import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'

import { visuallyHidden } from '@mui/utils'
import { chain, isNull, map } from 'lodash'
import { useMemo, useState } from 'react'
import getComparator from '../../../../helpers/getComparator'

const HEAD_CELLS = [
  { id: 'date', numeric: false, label: '日期' },
  { id: 'modified', numeric: true, label: '是否修改' },
  { id: 'workEarly', numeric: true, label: '提早上班' },
  { id: 'overtime', numeric: true, label: '加班' },
  {
    id: 'defaultWorkTime',
    numeric: true,
    label: '預定工作時間',
  },
  {
    id: 'totalWorkTime',
    numeric: true,
    label: '總工作時間',
  },
  {
    id: 'generalWorkTime',
    numeric: true,
    label: '一般工作時間',
  },
  { id: 'breakTime', numeric: true, label: '休息時間' },
  { id: 'leaveTime', numeric: true, label: '休假時間' },
  {
    id: 'absenceTime',
    numeric: true,
    label: '缺席時間',
  },
]

const EnhancedTableHead = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {map(HEAD_CELLS, ({ id, numeric, label }) => (
          <TableCell
            key={id}
            align={numeric ? 'right' : 'left'}
            sortDirection={orderBy === id ? order : false}
          >
            <TableSortLabel
              active={orderBy === id}
              direction={orderBy === id ? order : 'desc'}
              onClick={createSortHandler(id)}
            >
              {label}
              {orderBy === id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const Daily = ({ daily }) => {
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('date')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc'
    setOrder(isDesc ? 'asc' : 'desc')
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - daily.length) : 0

  const visibleRows = useMemo(
    () =>
      chain(daily)
        .slice()
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .value(),
    [daily, order, orderBy, page, rowsPerPage]
  )

  return (
    <>
      <TableContainer>
        <Table
          sx={{ minWidth: 1180 }}
          aria-labelledby='tableTitle'
          stickyHeader
        >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {isNull(daily) &&
              map(Array(rowsPerPage), (_x, index) => (
                <TableRow key={index}>
                  <TableCell component='th' scope='row'>
                    <Skeleton variant='text' width='80%' />
                  </TableCell>
                  <TableCell align='right'>
                    <Skeleton variant='text' width='80%' />
                  </TableCell>
                  <TableCell align='right'>
                    <Skeleton variant='text' width='80%' />
                  </TableCell>
                  <TableCell align='right'>
                    <Skeleton variant='text' width='80%' />
                  </TableCell>
                  <TableCell align='right'>
                    <Skeleton variant='text' width='80%' />
                  </TableCell>
                  <TableCell align='right'>
                    <Skeleton variant='text' width='80%' />
                  </TableCell>
                  <TableCell align='right'>
                    <Skeleton variant='text' width='80%' />
                  </TableCell>
                  <TableCell align='right'>
                    <Skeleton variant='text' width='80%' />
                  </TableCell>
                  <TableCell align='right'>
                    <Skeleton variant='text' width='80%' />
                  </TableCell>
                  <TableCell align='right'>
                    <Skeleton variant='text' width='80%' />
                  </TableCell>
                </TableRow>
              ))}
            {visibleRows.map((row, index) => (
              <TableRow hover key={row.date}>
                <TableCell component='th' scope='row'>
                  {row.date}
                </TableCell>
                <TableCell align='right'>{`${row.modified}`}</TableCell>
                <TableCell align='right'>{`${row.workEarly}`}</TableCell>
                <TableCell align='right'>{`${row.overtime}`}</TableCell>
                <TableCell align='right'>{row.defaultWorkTime}</TableCell>
                <TableCell align='right'>{row.totalWorkTime}</TableCell>
                <TableCell align='right'>{row.generalWorkTime}</TableCell>
                <TableCell align='right'>{row.breakTime}</TableCell>
                <TableCell align='right'>{row.leaveTime}</TableCell>
                <TableCell align='right'>{row.absenceTime}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!isNull(daily) && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={daily.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  )
}

export default Daily
