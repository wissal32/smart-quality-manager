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

    protected $appends = ['formatted_photos_before', 'formatted_photos_after'];

    protected function casts(): array
    {
        return [
            'tri' => 'boolean',
            'ranger' => 'boolean',
            'nettoyer' => 'boolean',
            'standardiser' => 'boolean',
            'maintenir' => 'boolean',
            'score' => 'decimal:2',
        ];
    }

    public function getFormattedPhotosBeforeAttribute()
    {
        if (!$this->photos_before) {
            return [];
        }

        $photoData = json_decode($this->photos_before, true);
        if (!is_array($photoData)) {
            return [];
        }

        // Handle legacy format (array of strings) and new format (array of objects with data/mime)
        return array_map(function ($photo) {
            // If it's a string (legacy URL format), return as is
            if (is_string($photo)) {
                return [
                    'url' => $photo,
                    'name' => 'Photo',
                ];
            }
            // If it's an array with data/mime (new base64 format)
            if (is_array($photo) && isset($photo['data'])) {
                return [
                    'url' => 'data:' . ($photo['mime'] ?? 'image/jpeg') . ';base64,' . $photo['data'],
                    'name' => $photo['name'] ?? 'Photo',
                ];
            }
            return [];
        }, $photoData);
    }

    public function getFormattedPhotosAfterAttribute()
    {
        if (!$this->photos_after) {
            return [];
        }

        $photoData = json_decode($this->photos_after, true);
        if (!is_array($photoData)) {
            return [];
        }

        // Handle legacy format (array of strings) and new format (array of objects with data/mime)
        return array_map(function ($photo) {
            // If it's a string (legacy URL format), return as is
            if (is_string($photo)) {
                return [
                    'url' => $photo,
                    'name' => 'Photo',
                ];
            }
            // If it's an array with data/mime (new base64 format)
            if (is_array($photo) && isset($photo['data'])) {
                return [
                    'url' => 'data:' . ($photo['mime'] ?? 'image/jpeg') . ';base64,' . $photo['data'],
                    'name' => $photo['name'] ?? 'Photo',
                ];
            }
            return [];
        }, $photoData);
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