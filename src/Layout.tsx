import { Outlet } from 'react-router';
import { Container, Box } from '@mui/material'

export function Layout() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Outlet />
      </Box>
    </Container>
  )
}
