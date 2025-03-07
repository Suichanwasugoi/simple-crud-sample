import React, { useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import Layout from '../../../components/Layout';
import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Box,
    Typography
} from '@mui/material';

export default function Index({ simplecrud, searchQuery, includeTrashed, pagination }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(searchQuery || '');
    const [showTrashed, setShowTrashed] = useState(includeTrashed === 'true');

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim() === '') {
            Inertia.get('/simplecrud', { include_trashed: showTrashed ? 'true' : 'false' });
        } else {
            Inertia.get('/simplecrud', { search, include_trashed: showTrashed ? 'true' : 'false' });
        }
    };

    const handleDelete = (id) => {
        if (confirm(`Are you sure you want to delete this data?`)) {
            Inertia.delete(`/simplecrud/${id}`, {
                preserveScroll: true,
                preserveState: true,
                data: {
                    page: pagination.current_page, 
                    search,
                    include_trashed: showTrashed ? 'true' : 'false',
                },
            });
        }
    };

    const handlePermanentDelete = (id) => {
        if (confirm(`Are you sure you want to permanently delete this data? This action cannot be undone.`)) {
            Inertia.delete(`/simplecrud/${id}/forceDelete`, {
                preserveScroll: true,
                preserveState: true,
                data: {
                    page: pagination.current_page,
                    search,
                    include_trashed: showTrashed ? 'true' : 'false',
                },
            });
        }
    };

    const toggleTrashed = () => {
        setShowTrashed(!showTrashed);
        Inertia.get('/simplecrud', 
            { search, include_trashed: !showTrashed ? 'true' : 'false', page: pagination.current_page },
            { preserveScroll: true, preserveState: true }
        );
    };

    const handleRestore = (id) => {
        if (confirm('Are you sure you want to restore this data?')) {
            Inertia.post(`/simplecrud/${id}/restore`, 
            {
                page: pagination.current_page, 
                search,
                include_trashed: showTrashed ? 'true' : 'false',
            }, 
            {
                preserveScroll: true, 
                preserveState: true,
            });
        }
    };

    const handlePageChange = (page) => {
        Inertia.get('/simplecrud', {
            page,
            search,
            include_trashed: showTrashed ? 'true' : 'false',
        }, { 
            preserveScroll: true 
        });
    };

    // Sort the simplecrud array to move soft deleted rows to the bottom
    const sortedSimpleCrud = [...simplecrud].sort((a, b) => {
        if (a.deleted_at && !b.deleted_at) {
            return 1;
        }
        if (!a.deleted_at && b.deleted_at) {
            return -1;
        }
        return 0;
    });

    return (
        <Layout>
            <Box>
                <Typography variant="h4" gutterBottom>
                    Data Simple Crud
                </Typography>
                {flash?.message && (
                    <Typography variant="body1" color="green" fontWeight="bold" mb={2}>
                        {flash.message}
                    </Typography>
                )}

                <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
                    <Box display="flex" alignItems="center">
                        <TextField
                            label="Search by UID, Name, Gender, Address"
                            variant="outlined"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            fullWidth
                            sx={{ mr: 2 }}
                        />
                        <Button type="submit" variant="contained" color="success" sx={{p: 2}}>
                            Search
                        </Button>
                    </Box>
                </form>

                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Link href="/simplecrud/form/add">
                        <Button variant="contained" color="primary">
                            Add New Data
                        </Button>
                    </Link>
                </Box>

                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button variant="outlined" color="warning" onClick={toggleTrashed}>
                        {showTrashed ? 'Hide Recently Deleted' : 'Show Recently Deleted'}
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>UID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedSimpleCrud.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6}>No data available...</TableCell>
                                </TableRow>
                            ) : (
                                sortedSimpleCrud.map((smc, index) => (
                                    <TableRow
                                        key={smc.id}
                                        sx={{
                                            backgroundColor: smc.deleted_at ? '#f8d7da' : 'transparent',
                                        }}
                                    >
                                        <TableCell>{(pagination.current_page - 1) * pagination.per_page + index + 1}</TableCell>
                                        <TableCell>{smc.uid}</TableCell>
                                        <TableCell>{smc.name}</TableCell>
                                        <TableCell>{smc.gender}</TableCell>
                                        <TableCell>{smc.address}</TableCell>
                                        <TableCell>
                                            {!smc.deleted_at && (
                                                <Link href={`/simplecrud/${smc.id}/edit`}>
                                                    <Button variant="outlined" color="info" size="small" sx={{ mr: 1 }}>
                                                        Edit
                                                    </Button>
                                                </Link>
                                            )}
                                            {smc.deleted_at ? (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        onClick={() => handleRestore(smc.id)}
                                                        sx={{ mr: 2 }}
                                                    >
                                                        Restore
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handlePermanentDelete(smc.id)}
                                                    >
                                                        Delete Permanently
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDelete(smc.id)}
                                                    sx={{ ml: 3 }}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <Box mt={2} display="flex" justifyContent="center" sx={{my: 2}}>
                    <Pagination
                        count={pagination.last_page}
                        page={pagination.current_page}
                        onChange={(event, value) => handlePageChange(value)}
                    />
                </Box>
            </Box>
        </Layout>
    );
}
