package com.pfa.backend.ai;

import java.util.List;

public record CareerPlanResponse(
        double compatibilityScore,   // 0..1
        List<ActionItemDto> actions
) {}
