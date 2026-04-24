<?php

namespace App\Services;

use App\Models\Action;
use App\Models\Equipment;
use App\Models\FiveSAudit;
use App\Models\Idea;
use App\Models\Incident;

class DashboardService
{
    public function stats(): array
    {
        return [
            'total_actions' => Action::count(),
            'open_incidents' => Incident::where('status', 'open')->count(),
            'total_equipments' => Equipment::count(),
            'ideas_submitted' => Idea::count(),
            'average_5s_score' => round((float) (FiveSAudit::avg('score') ?? 0), 2),
        ];
    }
}