<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SimpleCrudController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', [HomeController::class, 'index']);
Route::get('/about', [AboutController::class, 'index']);
Route::get('/contact', [ContactController::class, 'index']);

Route::resource('/simplecrud', SimpleCrudController::class);
Route::get('/simplecrud/form/add', [SimpleCrudController::class, 'formAdd']);
Route::get('/simplecrud/{id}/edit', [SimpleCrudController::class, 'edit'])->name('simplecrud.edit');
Route::put('/simplecrud/{id}', [SimpleCrudController::class, 'update'])->name('simplecrud.update');
Route::delete('/simplecrud/{id}', [SimpleCrudController::class, 'destroy'])->name('simplecrud.destroy');
Route::post('/simplecrud/{id}/restore', [SimpleCrudController::class, 'restore'])->name('simplecrud.restore');
Route::delete('/simplecrud/{id}/forceDelete', [SimpleCrudController::class, 'forceDelete'])->name('simplecrud.forceDelete');


