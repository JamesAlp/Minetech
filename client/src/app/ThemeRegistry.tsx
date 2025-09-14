'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { AppBar, Box, Button, CssBaseline, FormControlLabel, Link, Paper, Stack, Switch, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { SnackbarProvider } from 'notistack';

export default function ThemeRegistry({ children }: { children: React.ReactNode; }) {

  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(
    () => createTheme({
      palette: { mode: darkMode ? 'dark' : 'light' }
    }),
    [darkMode]
  );

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar position="static" color="primary" elevation={1}>
          <Toolbar>
            <Stack direction="row" flexGrow={1} justifyContent="space-between">
              <Stack direction="row">
                <Typography variant="h5" sx={{ mr: 2 }} component={Link} href="/" color="inherit">Minetech</Typography>

                <Button component={Link} href="/mods" color="inherit">Mods</Button>
                <Button component={Link} href="/blocks" color="inherit">Blocks</Button>
              </Stack>

              <FormControlLabel control={<Switch />} label="Dark Mode" value={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </Stack>
          </Toolbar>
        </AppBar>

        <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }} />
        <Paper sx={{ p: 3 }}>{children}</Paper>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
