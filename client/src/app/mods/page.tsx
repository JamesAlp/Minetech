'use client';

import { Paper, Table, TableCell, TableHead, TableRow, TableBody, Stack, Typography, Button, Box, Modal, TextField, ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { GetRequest, PostRequest } from "@/utilities/request.utility";
import { CreateModDTO, ModEntity } from "@/interfaces";
import { enqueueSnackbar } from "notistack";
import { handleError } from "@/utilities/error.utility";

export default function ModsPage() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };
  const [mods, setMods] = useState<ModEntity[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const body: CreateModDTO = {
      name: String(fd.get('modName'))
    };

    try {
      await PostRequest('/mods', body);
      enqueueSnackbar('Saved!', { variant: 'success' });
      handleClose();
      fetchMods();
    }
    catch (error: any) {
      handleError(error);
    }
  };

  const fetchMods = async () => {
    try {
      setMods(await GetRequest('/mods'));
    } catch (error: any) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchMods();
  }, []);

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Mods</Typography>
        <Button variant="contained" onClick={handleOpen}>Add Mod</Button>
      </Stack>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: 420 }}>
          <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Add Mod</Typography>

              <TextField
                fullWidth
                autoFocus
                name="modName"
                label="Mod Name"
                variant="standard"
                defaultValue=""
              />

              <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 1 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained">Add Mod</Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Modal>


      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              mods.map((mod: ModEntity, key: number) => (
                <TableRow key={key}>
                  <TableCell>{mod.name}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </Paper>
    </Stack >
  );
};
