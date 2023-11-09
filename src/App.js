import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Routes, Route } from 'react-router-dom'
import Basic from './layouts/Basic'
import Root from './pages/Root'
import Employees from './pages/Employees'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Routes>
      <Route path='/' element={<Basic />}>
        <Route index element={<Root />} />
        <Route path='employees'>
          <Route index element={<Employees />} />
        </Route>
        <Route path='enterprise' />
      </Route>
    </Routes>
  </ThemeProvider>
)

export default App
