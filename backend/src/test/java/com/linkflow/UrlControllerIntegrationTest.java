package com.linkflow;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkflow.repository.UrlRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.hasLength;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UrlControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UrlRepository urlRepository;

    @BeforeEach
    void setUp() {
        urlRepository.deleteAll();
    }

    @Test
    void fullUrlLifecycleCreateListRedirectTrackClickAndDelete() throws Exception {
        String originalUrl = "https://example.com/products/electronics/smartphones/latest-model";
        String payload = """
                {
                  "originalUrl": "%s"
                }
                """.formatted(originalUrl);

        MvcResult createResult = mockMvc.perform(post("/api/urls")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.originalUrl", is(originalUrl)))
                .andExpect(jsonPath("$.shortCode", hasLength(6)))
                .andExpect(jsonPath("$.shortUrl", startsWith("http://localhost:8080/")))
                .andExpect(jsonPath("$.clickCount", is(0)))
                .andExpect(jsonPath("$.createdAt", notNullValue()))
                .andReturn();

        JsonNode created = objectMapper.readTree(createResult.getResponse().getContentAsString());
        long id = created.get("id").asLong();
        String shortCode = created.get("shortCode").asText();

        // List all URLs
        mockMvc.perform(get("/api/urls"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].shortCode", is(shortCode)));

        // Redirect using shortCode (HTTP 302)
        mockMvc.perform(get("/" + shortCode))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", originalUrl));

        // Verify click count incremented
        mockMvc.perform(get("/api/urls/" + shortCode))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clickCount", is(1)));

        // Delete URL
        mockMvc.perform(delete("/api/urls/" + id))
                .andExpect(status().isNoContent());

        // Confirm deleted URL returns 404
        mockMvc.perform(get("/" + shortCode))
                .andExpect(status().isNotFound());
    }

    @Test
    void rejectsEmptyAndMalformedUrls() throws Exception {
        mockMvc.perform(post("/api/urls")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "originalUrl": "" }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", notNullValue()));

        mockMvc.perform(post("/api/urls")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "originalUrl": "not-a-valid-url" }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", notNullValue()));

        mockMvc.perform(post("/api/urls")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "originalUrl": "ftp://example.com/file" }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", notNullValue()));
    }

    @Test
    void returnsNotFoundForUnknownShortCode() throws Exception {
        mockMvc.perform(get("/unknown1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)));

        mockMvc.perform(get("/api/urls/unknown1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)));
    }
}
