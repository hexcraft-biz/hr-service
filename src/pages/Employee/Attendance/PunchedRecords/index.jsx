import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'

import { visuallyHidden } from '@mui/utils'

import dayjs from 'dayjs'
import { chain, isNull, map } from 'lodash'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import getComparator from '../../../../helpers/getComparator'
import Search from '../../../../components/Search'
import sleep from '../../../../helpers/sleep'

const RecordDialog = ({ open, onClose, callback }) => {
  let isNew = open === 'new'
  const [type, setType] = useState(isNew ? '' : open.type)
  const [date, setDate] = useState(isNew ? null : dayjs(open.date))
  const [time, setTime] = useState(
    isNew ? null : dayjs(`${open.date}T${open.time}`)
  )

  return (
    <Dialog open={Boolean(open)} onClose={onClose}>
      <DialogTitle>{open === 'new' ? 'New Record' : 'Edit Record'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl variant='standard' fullWidth>
              <InputLabel id='record-type'>類型</InputLabel>
              <Select
                labelId='record-type'
                id='type'
                value={type}
                label='類型'
                onChange={e => setType(e.target.value)}
              >
                <MenuItem value='MODIFIED'>Modified</MenuItem>
                <MenuItem value='GENERAL'>General</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label='日期'
              value={date}
              slotProps={{
                textField: { variant: 'standard', fullWidth: true },
              }}
              onChange={newValue => setDate(newValue)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label='時間'
              views={['hours', 'minutes', 'seconds']}
              value={time}
              slotProps={{
                textField: { variant: 'standard', fullWidth: true },
              }}
              onChange={newValue => setTime(newValue)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant='contained'
          autoFocus
          onClick={() => callback({ type, date, time, id: open?.id })}
          disabled={!(type && date && time)}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const DeleteDialog = ({ open, onClose, callback }) => (
  <Dialog open={Boolean(open)} onClose={onClose}>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this record?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} autoFocus>
        Cancel
      </Button>
      <Button color='error' variant='outlined' onClick={callback}>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
)

const HEAD_CELLS = [
  { id: 'type', sortable: false, label: '類型' },
  { id: 'date', sortable: true, label: '日期' },
  { id: 'time', sortable: false, label: '時間' },
  { id: 'actions', sortable: false, label: '操作' },
]

const EnhancedTableHead = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {map(HEAD_CELLS, ({ id, label, sortable }) => (
          <TableCell key={id} sortDirection={orderBy === id ? order : false}>
            {sortable ? (
              <TableSortLabel
                active={orderBy === id}
                direction={orderBy === id ? order : 'desc'}
                onClick={createSortHandler(id)}
              >
                {label}
                {orderBy === id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const PunchedRecords = ({ punchedRecords, refresh }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [keyword, setKeyword] = useState('')
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('date')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [open, setOpen] = useState({
    record: false,
    delete: false,
  })

  const handleChangeKeyword = value => {
    setPage(0)
    setKeyword(value)
  }

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - punchedRecords.length) : 0

  const visibleRows = useMemo(
    () =>
      chain(punchedRecords)
        .slice()
        .filter(
          ({ type, date, time }) =>
            type.toLowerCase().includes(keyword.toLowerCase()) ||
            date.toLowerCase().includes(keyword.toLowerCase()) ||
            time.toLowerCase().includes(keyword.toLowerCase())
        )
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .value(),
    [punchedRecords, keyword, order, orderBy, page, rowsPerPage]
  )

  const handleClose = () => {
    setOpen({ record: false, delete: false })
  }

  const add = value => {
    sleep(500).then(() => {
      enqueueSnackbar('New Record has been added.', { variant: 'success' })
    })
  }

  const edit = value => {
    sleep(500).then(() => {
      enqueueSnackbar('Record has been updated.', { variant: 'success' })
    })
  }

  const handleUpdate = record => async value => {
    handleClose()
    if (record === 'new') {
      await add(value)
    } else {
      await edit(value)
    }
    refresh()
  }

  const remove = () => {
    sleep(500).then(() => {
      enqueueSnackbar('Record has been removed.', { variant: 'info' })
    })
  }

  const handleDelete = async () => {
    handleClose()
    await remove()
    refresh()
  }

  return (
    <>
      <TableContainer>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Search
            onChange={handleChangeKeyword}
            sx={theme => ({
              marginRight: theme.spacing(1),
              width: 'auto',
            })}
          />
          <Button
            variant='contained'
            sx={{ ml: 'auto' }}
            onClick={() =>
              setOpen({
                record: 'new',
                delete: false,
              })
            }
            startIcon={<AddIcon />}
          >
            New
          </Button>
        </Toolbar>
        <Table stickyHeader>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {isNull(punchedRecords) &&
              map(Array(rowsPerPage), (_x, index) => (
                <TableRow key={index}>
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
                    <Stack direction='row'>
                      <Skeleton variant='circular' width={34} height={34} />
                      <Skeleton variant='circular' width={34} height={34} />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            {visibleRows.map(({ id, type, date, time }, index) => (
              <TableRow hover key={id}>
                <TableCell component='th' scope='row'>
                  {type}
                </TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>{time}</TableCell>
                <TableCell>
                  <IconButton
                    size='small'
                    onClick={() =>
                      setOpen({
                        record: { id, type, date, time },
                        delete: false,
                      })
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() =>
                      setOpen({
                        record: false,
                        delete: id,
                      })
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
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
      {!isNull(punchedRecords) && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={punchedRecords.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      {Boolean(open.record) && (
        <RecordDialog
          open={open.record}
          onClose={handleClose}
          callback={handleUpdate(open.record)}
        />
      )}
      {Boolean(open.delete) && (
        <DeleteDialog
          open={open.delete}
          onClose={handleClose}
          callback={handleDelete}
        />
      )}
    </>
  )
}

export default PunchedRecords
