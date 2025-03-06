<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SimpleCrud extends Model
{
    use SoftDeletes;
    use HasFactory;

    protected $table = 'simple_crud';
    protected $primaryKey = 'id';
    protected $fillable = ['uid', 'name', 'gender', 'address '];

    protected $dates = ['deleted_at'];
}
