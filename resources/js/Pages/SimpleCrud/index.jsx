import React, { useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../../../components/Layout';

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
                    page: pagination.current_page, // Keep the user on the current page
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
                    page: pagination.current_page, // Keep the user on the current page
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
                page: pagination.current_page, // Keep user on the same page
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
        const targetScrollY = window.scrollY; // Capture current scroll position
    
        Inertia.get('/simplecrud', {
            page,
            search,
            include_trashed: showTrashed ? 'true' : 'false',
        }, { 
            preserveScroll: true 
        });
    
        // Smoothly scroll down after the new page loads
        setTimeout(() => {
            let start = window.scrollY;
            let distance = targetScrollY - start;
            let duration = 600; // Duration in ms
            let startTime = null;
    
            const smoothScroll = (timestamp) => {
                if (!startTime) startTime = timestamp;
                let progress = timestamp - startTime;
                let ease = Math.min(progress / duration, 1); // Ease in-out effect
    
                window.scrollTo(0, start + distance * ease);
    
                if (progress < duration) {
                    requestAnimationFrame(smoothScroll);
                }
            };
    
            requestAnimationFrame(smoothScroll);
        }, 100); // Small delay to allow the new content to render
    };
    
    

    // Sort the simplecrud array to move soft deleted rows to the bottom
    const sortedSimpleCrud = [...simplecrud].sort((a, b) => {
        if (a.deleted_at && !b.deleted_at) {
            return 1; // Move soft deleted to the bottom
        }
        if (!a.deleted_at && b.deleted_at) {
            return -1; // Keep non-deleted at the top
        }
        return 0; // Keep order for others
    });

    return (
        <Layout>
            <div>
                <h3>Data Simple Crud</h3>
                <hr />

                {flash?.message && (
                    <div style={{ fontWeight: 'bold', color: 'green', marginBottom: 10 }}>
                        {flash.message}
                    </div>
                )}

                <form onSubmit={handleSearch} style={{ marginBottom: 10 }}>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by UID, Name, Gender, Address"
                            value={search}
                            aria-describedby="button-addon2"
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ padding: 15, marginRight: 5 }}
                        />
                        <button className="btn btn-outline-success" type="submit" id="button-addon2">
                            Search
                        </button>
                    </div>
                </form>

                <div className='d-flex justify-content-end'>
                <Link className="btn btn-sm btn-primary" as="button" type="button" href="/simplecrud/add" style={{ padding: 10, marginTop: 10, marginBottom: -10 }}>
                    Add New Data
                </Link>
                </div>

                <br />
                <div className='d-flex justify-content-end'>
                <button className="btn btn-sm btn-warning" onClick={toggleTrashed} style={{ padding: 10, marginBottom: 20 }}>
                    {showTrashed ? 'Hide Recently Deleted' : 'Show Recently Deleted'}
                </button>
                </div>

                <table className="table table-bordered table-striped table-sm">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>UID</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSimpleCrud.length === 0 ? (
                            <tr>
                                <th colSpan={6}>No data available...</th>
                            </tr>
                        ) : (
                            sortedSimpleCrud.map((smc, index) => (
                                <tr
                                    key={smc.id}
                                    style={{
                                        backgroundColor: smc.deleted_at ? '#f8d7da' : 'transparent',
                                    }}
                                >
                                    <td>{(pagination.current_page - 1) * pagination.per_page + index + 1}</td>
                                    <td>{smc.uid}</td>
                                    <td>{smc.name}</td>
                                    <td>{smc.gender}</td>
                                    <td>{smc.address}</td>
                                    <td>
                                        {!smc.deleted_at && (
                                            <Link className="btn btn-sm btn-info" as="button" type="button" href={`/simplecrud/${smc.id}/edit`} style={{ padding: 6, marginRight: -40, marginLeft: 20 }}>
                                                Edit
                                            </Link>
                                        )}
                                        {smc.deleted_at ? (
                                            <>
                                                <button className="btn btn-sm btn-success" onClick={() => handleRestore(smc.id)} style={{ padding: 6, marginRight: 10, marginLeft: 20 }}>
                                                    Restore
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handlePermanentDelete(smc.id)} style={{ padding: 6}}>
                                                    Delete Permanently
                                                </button>
                                            </>
                                        ) : (
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(smc.id)} style={{ padding: 6, marginLeft: 50, marginRight: -30}}>
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination links */}
                {pagination && (
                    <ul className="pagination" style={{ justifyContent: 'center', marginTop: 20 }}>
                        {/* Previous Button (Hidden when on the first page) */}
                        {pagination.current_page > 1 && (
                            <li className="page-item">
                                <a
                                    className="page-link"
                                    href="#"
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                >
                                    Previous
                                </a>
                            </li>
                        )}

                        {/* Pagination Numbers */}
                        {Array.from({ length: pagination.last_page }).map((_, index) => (
                            <li
                                key={index}
                                className={`page-item ${pagination.current_page === index + 1 ? 'active' : ''}`}
                            >
                                <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </a>
                            </li>
                        ))}

                        {/* Next Button (Hidden when on the last page) */}
                        {pagination.current_page < pagination.last_page && (
                            <li className="page-item">
                                <a
                                    className="page-link"
                                    href="#"
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                >
                                    Next
                                </a>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </Layout>
    );
}
