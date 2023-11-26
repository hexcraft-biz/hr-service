import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'

import { map } from 'lodash'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { ROUTES } from '../../constants'

const drawerWidth = 240

const ROUTES_WITH_ICON = map(ROUTES, ({ title, ...rest }) => {
  let icon = null
  if (title === 'index') {
    icon = DashboardIcon
  } else if (title === 'employees') {
    icon = PeopleIcon
  } else if (title === 'enterprise') {
    icon = CalendarMonthIcon
  }
  return {
    ...rest,
    title,
    icon,
  }
})

const Basic = props => {
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Toolbar />
      <Divider />
      <List>
        {ROUTES_WITH_ICON.map(({ title, icon: Icon, path }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton component={NavLink} to={path}>
              <ListItemIcon>{Boolean(Icon) && <Icon />}</ListItemIcon>
              <ListItemText
                primary={title}
                sx={{ textTransform: 'capitalize' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component='nav'>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, cursor: 'default' }}
          >
            HR Service
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {ROUTES_WITH_ICON.map(({ title, icon, path }) => (
              <Button
                key={path}
                sx={{ ml: 1.5, color: '#fff', textTransform: 'capitalize' }}
                component={NavLink}
                to={path}
              >
                {title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          width: '100vw',
          height: '100vh',
        }}
      >
        <Toolbar />
        <Box component='main' sx={{ p: 3, flex: '1 1 auto', overflow: 'auto' }}>
          <Outlet />
        </Box>
        <Toolbar variant='dense'>
          <Typography variant='caption'>
            Copyright © {new Date().getFullYear()}, HEXCraft. All Rights
            Reserved.
          </Typography>
        </Toolbar>
      </Box>
    </Box>
  )
}

export default Basic
