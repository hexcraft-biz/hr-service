import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SnackbarProvider } from 'notistack'
import { Routes, Route } from 'react-router-dom'
import Basic from './layouts/Basic'
import Root from './pages/Root'
import Employees from './pages/Employees'
import Employee from './pages/Employee'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <SnackbarProvider>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<Basic />}>
          <Route index element={<Root />} />
          <Route path='employees'>
            <Route index element={<Employees />} />
            <Route path=':id' element={<Employee />} />
          </Route>
          <Route path='enterprise' />
        </Route>
      </Routes>
    </SnackbarProvider>
  </ThemeProvider>
)

export default App
