import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className='container container-fluid'>
            <h1>Edit Data</h1>
            <hr />
            <Link className='btn btn-sm btn-primary' as='button' type='button' href='/simplecrud' style={{ marginBottom: 10 }}>
                Go Back
            </Link>
            <form onSubmit={updateData}>
                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Input UID</label>
                    <div className="col-sm-4">
                        <input 
                            type="text" 
                            className={`form-control ${errors.auid && 'is-invalid'}`} 
                            maxLength={7} 
                            value={auid} 
                            onChange={(e) => setAuid(e.target.value)} 
                            placeholder="Insert UID here..." 
                            size={50} 
                        />
                        {errors.auid && <div className="invalid-feedback">{errors.auid}</div>}
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Input Name</label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className={`form-control ${errors.aname && 'is-invalid'}`} 
                            value={aname} 
                            onChange={(e) => setAname(e.target.value)} 
                            placeholder="Insert Name here..." 
                            size={50} 
                        />
                        {errors.aname && <div className="invalid-feedback">{errors.aname}</div>}
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Choose Gender</label>
                    <div className="col-sm-2">
                        <select 
                            className={`form-select ${errors.agender && 'is-invalid'}`}  
                            onChange={(e) => setAgender(e.target.value)} 
                            value={agender}
                        >
                            <option value="">-Choose-</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {errors.agender && <div className="invalid-feedback">{errors.agender}</div>}
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Input Address</label>
                    <div className="col-sm-10">
                        <textarea 
                            className={`form-control ${errors.aaddress && 'is-invalid'}`} 
                            value={aaddress} 
                            onChange={(e) => setAaddress(e.target.value)} 
                            placeholder="Insert Address here..." 
                            cols={50} 
                            rows={5} 
                        />
                        {errors.aaddress && <div className="invalid-feedback">{errors.aaddress}</div>}
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label"></label>
                    <div className="col-sm-4">
                        <button className='btn btn-sm btn-success' type='submit' disabled={loading}>
                            {loading ? 'Updating...' : 'Update Data'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
