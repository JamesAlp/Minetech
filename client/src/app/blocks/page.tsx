'use client';

import { Paper, Table, TableCell, TableHead, TableRow, TableBody, Stack, Typography, Button, Box, Modal, TextField, ButtonGroup, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { GetRequest, PostRequest, UpdateRequest } from "@/utilities/request.utility";
import { BlockEntity, BlockType, CreateBlockDTO, ModEntity, UpdateBlockDTO } from "@/interfaces";
import { enqueueSnackbar } from "notistack";
import { handleError } from "@/utilities/error.utility";
import { DeleteOutline } from "@mui/icons-material";

export default function BlocksPage() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };
  const [mods, setMods] = useState<ModEntity[]>([]);
  const [blocks, setBlocks] = useState<BlockEntity[]>([]);
  const [createBlockFormType, SetCreateBlockFormType] = useState(BlockType.NONE);
  const [blockTypeFilter, SetBlockTypeFilter] = useState<BlockType>(BlockType.NONE);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const body: CreateBlockDTO = {
      name: String(fd.get('blockName')),
      type: fd.get('blockType') as BlockType,
      modName: String(fd.get('modName'))
    };

    if (createBlockFormType === BlockType.RF_GENERATOR) body.rfPerTick = Number(fd.get('rfPerTick'));

    try {
      await PostRequest('/blocks', body);
      enqueueSnackbar('Created!', { variant: 'success' });
      handleClose();
      fetchBlocks();
    }
    catch (error: any) {
      handleError(error);
    }
  };

  const handleUpdate = async (e: any, block: BlockEntity) => {
    e.preventDefault();

    const body: UpdateBlockDTO = {
      id: block.id,
      name: block.name,
      type: block.type,
      modName: block.mod.name
    };

    if (blockTypeFilter === BlockType.RF_GENERATOR) {
      const rfPerTickInput: HTMLInputElement = document.getElementsByName(`rfPerTick-${block.id}`)[0] as HTMLInputElement;

      body.rfGenerator = block.rfGenerator;
      body.rfGenerator.rfPerTick = Number(rfPerTickInput.value);
    }

    try {
      await UpdateRequest('/blocks', body);
      enqueueSnackbar('Updated!', { variant: 'success' });
      handleClose();
      fetchBlocks();
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

  const fetchBlocks = async () => {
    try {
      setBlocks(await GetRequest('/blocks'));
    } catch (error: any) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchMods();
    fetchBlocks();
  }, []);

  type Entry = [keyof typeof BlockType, string];
  const blockTypeEntries = useMemo(() => Object.entries(BlockType) as Entry[], []);

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Blocks</Typography>
        <Button variant="contained" onClick={handleOpen}>Add Block</Button>
      </Stack>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, width: 420 }}>
          <Paper component="form" onSubmit={handleCreate} sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Add Block</Typography>

              <TextField
                fullWidth
                autoFocus
                name="blockName"
                label="Block Name"
                variant="standard"
                defaultValue=""
                required
              />

              <FormControl fullWidth variant="standard">
                <InputLabel id="block-type-select-label">Block Type</InputLabel>
                <Select
                  labelId="block-type-select-label"
                  name="blockType"
                  defaultValue=""
                  required
                  onChange={(e) => SetCreateBlockFormType(e.target.value as any)}
                >
                  <MenuItem value="" disabled>Select a block...</MenuItem>
                  {blockTypeEntries.map(([key, label], keyN: number) => (
                    <MenuItem key={key} value={label}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {createBlockFormType === BlockType.RF_GENERATOR && (
                <TextField
                  fullWidth
                  autoFocus
                  name="rfPerTick"               // use a consistent lowerCamelCase key
                  label="RF/t"
                  variant="standard"
                  type="number"                  // HTML number input
                  defaultValue=""                // keep uncontrolled; empty when opening
                  required
                  slotProps={{
                    htmlInput: {
                      inputMode: 'numeric',        // mobile numeric keypad
                      pattern: '[0-9]*',           // extra hint for numeric only
                      min: 0,
                      step: 1
                    }
                  }}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()} // optional: prevent scroll changing value
                  onKeyDown={(e) => {            // optional: block e, +, -, .
                    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
                  }}
                />
              )}

              <FormControl fullWidth variant="standard">
                <InputLabel id="mod-select-label">Mod</InputLabel>
                <Select
                  labelId="mod-select-label"
                  name="modName"
                  defaultValue=""
                  required
                >
                  <MenuItem value="" disabled>Select a mod...</MenuItem>
                  {mods.map((mod: ModEntity, key: number) => (
                    <MenuItem key={key} value={mod.name}>
                      {mod.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 1 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained">Add Block</Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Modal>

      <Paper sx={{ p: 2 }}>
        <FormControl size="small" variant="standard">
          <InputLabel id="type-filter-label">Block Type</InputLabel>
          <Select
            labelId="type-filter-label"
            label="Block Type"
            value={blockTypeFilter}
            onChange={(e) => SetBlockTypeFilter(e.target.value)}
            sx={{ width: 120 }} >
            {blockTypeEntries.map(([key, label], keyN: number) => (
              <MenuItem key={key} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Mod</TableCell>
              {blockTypeFilter === BlockType.RF_GENERATOR &&
                <TableCell sx={{ width: 120 }}>RF/t</TableCell>
              }
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {blocks
              .filter((block: BlockEntity) => blockTypeFilter === BlockType.NONE || block.type === blockTypeFilter)
              .map((block: BlockEntity, key: number) => (
                <TableRow key={key}>
                  <TableCell data-id={`block-name-${block.id}`}>{block.name}</TableCell>
                  <TableCell data-id={`block-type-${block.id}`}>{block.type}</TableCell>
                  <TableCell data-id={`block-mod-${block.id}`}>{block.mod.name}</TableCell>
                  {blockTypeFilter === BlockType.RF_GENERATOR &&
                    <TableCell>
                      <TextField
                        name={`rfPerTick-${block.id}`}
                        variant="standard"
                        sx={{
                          '& .MuiInputBase-input': { py: 1, cursor: 'text' },
                          // hide underline by default
                          '& .MuiInput-underline:before': { borderBottomColor: 'transparent' },
                          // show underline on hover/focus
                          '&:hover .MuiInput-underline:before': { borderBottomColor: 'primary.main' },
                          '& .MuiInput-underline:after': { borderBottomColor: 'primary.main' },
                          // show an edit icon only on hover
                          '& .editIcon': { opacity: 0, transition: 'opacity .15s' },
                          '&:hover .editIcon': { opacity: 0.6 },
                          width: 120
                        }}
                        type="number"
                        defaultValue={block.rfGenerator.rfPerTick}
                        onBlur={(e) => handleUpdate(e, block)} />
                    </TableCell>
                  }
                  <TableCell>
                    <Tooltip title="Delete block">
                      <IconButton
                        size="small"
                        color="error"
                        aria-label="Delete" >
                        <DeleteOutline fontSize="small"></DeleteOutline>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>

        </Table>
      </Paper>
    </Stack >
  );
};
