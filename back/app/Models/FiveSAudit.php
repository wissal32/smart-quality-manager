<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FiveSAudit extends Model
{
    use HasFactory;

    protected $fillable = [
        'zone_id',
        'tri',
        'ranger',
        'nettoyer',
        'standardiser',
        'maintenir',
        'score',
        'photos_before',
        'photos_after',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'tri' => 'boolean',
            'ranger' => 'boolean',
            'nettoyer' => 'boolean',
            'standardiser' => 'boolean',
            'maintenir' => 'boolean',
            'score' => 'decimal:2',
            'photos_before' => 'array',
            'photos_after' => 'array',
        ];
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}