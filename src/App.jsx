import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import { SnackbarProvider } from 'notistack'
import { Routes, Route } from 'react-router-dom'
import Basic from './layouts/Basic'
import Root from './pages/Root'
import Employees from './pages/Employees'
import Employee from './pages/Employee'
import Attendance from './pages/Employee/Attendance'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SnackbarProvider>
        <CssBaseline />
        <Routes>
          <Route path='/' element={<Basic />}>
            <Route index element={<Root />} />
            <Route path='employees'>
              <Route index element={<Employees />} />
              <Route path=':id'>
                <Route index element={<Employee />} />
                <Route path='attendance' element={<Attendance />} />
              </Route>
            </Route>
            <Route path='enterprise' />
          </Route>
        </Routes>
      </SnackbarProvider>
    </LocalizationProvider>
  </ThemeProvider>
)

export default App
