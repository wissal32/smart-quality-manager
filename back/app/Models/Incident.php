<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'location',
        'severity',
        'cause',
        'corrective_action',
        'photos',
        'status',
        'reported_by',
        'assigned_to',
    ];

    protected $appends = ['formatted_photos'];

    public function getFormattedPhotosAttribute()
    {
        if (!$this->photos) {
            return [];
        }

        $photoData = json_decode($this->photos, true);
        if (!is_array($photoData)) {
            return [];
        }

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

    public function reportedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}