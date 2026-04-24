<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $table = 'equipments';

    protected $fillable = [
        'name',
        'type',
        'serial_number',
        'status',
        'qr_code',
        'last_maintenance',
    ];

    protected function casts(): array
    {
        return [
            'last_maintenance' => 'date',
        ];
    }
}