package com.pfa.backend.ai;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class CareerAiClient {

    private final RestTemplate restTemplate;
    private static final String BASE_URL = "http://localhost:8001";

    public CareerAiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public CareerPlanResponse getCareerPlan(String profileText, String objectiveText, int maxActions) {
        String url = BASE_URL + "/career-plan";

        Map<String, Object> body = new HashMap<>();
        body.put("profileText", profileText);
        body.put("objectiveText", objectiveText);
        body.put("maxActions", maxActions);

        return restTemplate.postForObject(url, body, CareerPlanResponse.class);
    }
}
