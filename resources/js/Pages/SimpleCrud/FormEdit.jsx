import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

// MUI Components
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';

export default function FormEdit({ simpleCrud }) {
    const [auid, setAuid] = useState(simpleCrud.uid);
    const [aname, setAname] = useState(simpleCrud.name);
    const [agender, setAgender] = useState(simpleCrud.gender);
    const [aaddress, setAaddress] = useState(simpleCrud.address);

    const [loading, setLoading] = useState(false);

    const { errors } = usePage().props;

    const updateData = (e) => {
        e.preventDefault();
        setLoading(true);

        const simple_cruds = { auid, aname, agender, aaddress };

        Inertia.put(`/simplecrud/${simpleCrud.id}`, simple_cruds, {
            onFinish: () => setLoading(false)
        });
    };

    return (
        <div className='d-flex justify-content-center' style={{ marginTop: 20, padding: 40 }}>
            <h1>Edit Data</h1>
            <hr />
            <Link href="/simplecrud">
                <Button variant="outlined" sx={{ marginBottom: 2 }}>
                    Go Back
                </Button>
            </Link>
            <form onSubmit={updateData}>
                <Box sx={{ mb: 3 }}>
                    <TextField
                        label="Input UID"
                        variant="outlined"
                        value={auid}
                        onChange={(e) => setAuid(e.target.value)}
                        helperText={errors.auid}
                        error={!!errors.auid}
                        inputProps={{ maxLength: 7 }}
                        placeholder="Insert UID here..."
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        label="Input Name"
                        variant="outlined"
                        fullWidth
                        value={aname}
                        onChange={(e) => setAname(e.target.value)}
                        helperText={errors.aname}
                        error={!!errors.aname}
                        placeholder="Insert Name here..."
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <FormControl sx={{ width: 200 }} error={!!errors.agender}>
                        <InputLabel>Choose Gender</InputLabel>
                        <Select
                            value={agender}
                            onChange={(e) => setAgender(e.target.value)}
                            label="Choose Gender"
                        >
                            <MenuItem value="">
                                <em>-Choose-</em>
                            </MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </Select>
                        <p style={{ color: 'red' }}>{errors.agender}</p>
                    </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        label="Input Address"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={aaddress}
                        onChange={(e) => setAaddress(e.target.value)}
                        helperText={errors.aaddress}
                        error={!!errors.aaddress}
                        placeholder="Insert Address here..."
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Data'}
                    </Button>
                </Box>
            </form>
        </div>
    );
}
