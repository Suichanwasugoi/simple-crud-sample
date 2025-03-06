<?php

namespace App\Http\Controllers;

use App\Models\SimpleCrud;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SimpleCrudController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = SimpleCrud::query();

        // Optionally include soft-deleted records (can be controlled via a query parameter)
        if ($request->has('include_trashed') && $request->input('include_trashed') === 'true') {
            $query->withTrashed();  // This will include soft-deleted records
        }

        // Apply search filters
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('uid', 'LIKE', "%{$search}%")
                  ->orWhere('address', 'LIKE', "%{$search}%");
        
                // Exact match for gender, to avoid matching substrings
                $q->orWhere('gender', '=', $search); 
            });
        }

        // Paginate the results, 10 per page
        $simple_cruds = $query->paginate(10);

        // Pass the paginated result
        return Inertia::render('SimpleCrud/Index', [
            'simplecrud' => $simple_cruds->items(),  // Ensure we're passing only the data (not pagination meta data)
            'pagination' => $simple_cruds,           // Pass the full pagination metadata
            'searchQuery' => $request->input('search', ''),
            'includeTrashed' => $request->input('include_trashed', false),
        ]);
    }



    public function formAdd()
    {
        return Inertia::render('SimpleCrud/FormAdd');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validateData = $request->validate([
        'auid' => 'required|unique:simple_crud,uid',
        'aname' => 'required',
        'agender' => 'required',
        'aaddress' => 'required'
    ], [], [
        'auid' => 'UID',
        'aname' => 'Name',
        'agender' => 'Gender',
        'aaddress' => 'Address'
    ]);

    $simple_cruds = new SimpleCrud();

    $simple_cruds->uid = $validateData['auid'];
    $simple_cruds->name = $validateData['aname'];
    $simple_cruds->gender = $validateData['agender'];
    $simple_cruds->address = $validateData['aaddress'];

    $simple_cruds->save();

    return redirect()->route('simplecrud.index')->with('message', 'Data has been Saved!...');
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
    $simpleCrud = SimpleCrud::find($id);
    return Inertia::render('SimpleCrud/FormEdit', ['simpleCrud' => $simpleCrud]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
    $validateData = $request->validate([
        'auid' => 'required|unique:simple_crud,uid,' . $id,
        'aname' => 'required',
        'agender' => 'required',
        'aaddress' => 'required'
    ], [], [
        'auid' => 'UID',
        'aname' => 'Name',
        'agender' => 'Gender',
        'aaddress' => 'Address'
    ]);

    $simpleCrud = SimpleCrud::find($id);
    $simpleCrud->uid = $validateData['auid'];
    $simpleCrud->name = $validateData['aname'];
    $simpleCrud->gender = $validateData['agender'];
    $simpleCrud->address = $validateData['aaddress'];

    $simpleCrud->save();

    return redirect()->route('simplecrud.index')->with('message', 'Data has been updated!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id, Request $request)
    {
        $simpleCrud = SimpleCrud::findOrFail($id);
        $name = $simpleCrud->name;
        $simpleCrud->delete();

        return redirect()->route('simplecrud.index', [
            'page' => $request->input('page', 1), // Keep current page
            'search' => $request->input('search', ''), // Maintain search
            'include_trashed' => $request->input('include_trashed', 'false'), // Keep trashed filter
        ])->with('message', 'Data with the Name : ' . $name . ' has been successfully deleted!');
    }


    public function restore($id, Request $request)
    {
        $simpleCrud = SimpleCrud::onlyTrashed()->findOrFail($id);
        $simpleCrud->restore();

        return redirect()->route('simplecrud.index', [
            'page' => $request->input('page', 1), // Keep current page
            'search' => $request->input('search', ''), // Maintain search
            'include_trashed' => $request->input('include_trashed', 'false'), // Keep trashed filter
        ])->with('message', 'Data has been restored successfully!');
    }


    public function forceDelete($id)
    {
        $simpleCrud = SimpleCrud::onlyTrashed()->findOrFail($id);
        $simpleCrud->forceDelete();

        return redirect()->route('simplecrud.index')
            ->with('message', 'Data has been permanently deleted!');
    }


}
