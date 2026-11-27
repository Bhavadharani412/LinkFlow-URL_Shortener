package com.linkflow.service.impl;

import com.linkflow.dto.UrlRequest;
import com.linkflow.dto.UrlResponse;
import com.linkflow.entity.Url;
import com.linkflow.exception.UrlNotFoundException;
import com.linkflow.repository.UrlRepository;
import com.linkflow.service.ShortCodeGenerator;
import com.linkflow.service.UrlService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Service
public class UrlServiceImpl implements UrlService {

    private static final int MAX_GENERATION_ATTEMPTS = 10;

    private final UrlRepository urlRepository;
    private final ShortCodeGenerator shortCodeGenerator;
    private final String baseUrl;

    public UrlServiceImpl(
            UrlRepository urlRepository,
            ShortCodeGenerator shortCodeGenerator,
            @Value("${app.base-url:http://localhost:8080}") String baseUrl
    ) {
        this.urlRepository = urlRepository;
        this.shortCodeGenerator = shortCodeGenerator;
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }

    @Override
    @Transactional
    public UrlResponse createShortUrl(UrlRequest request) {
        String normalizedUrl = validateAndNormalizeUrl(request.getOriginalUrl());
        String shortCode = generateUniqueShortCode();

        Url url = Url.builder()
                .originalUrl(normalizedUrl)
                .shortCode(shortCode)
                .clickCount(0L)
                .build();

        Url saved = urlRepository.save(url);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UrlResponse> getAllUrls() {
        return urlRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UrlResponse getUrlByShortCode(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("Short URL not found for code: " + shortCode));
        return toResponse(url);
    }

    @Override
    @Transactional
    public String resolveOriginalUrl(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("Short URL not found for code: " + shortCode));
        urlRepository.incrementClickCount(url.getId());
        return url.getOriginalUrl();
    }

    @Override
    @Transactional
    public void deleteUrl(Long id) {
        if (!urlRepository.existsById(id)) {
            throw new UrlNotFoundException("URL not found with id: " + id);
        }
        urlRepository.deleteById(id);
    }

    private String generateUniqueShortCode() {
        for (int attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
            String candidate = shortCodeGenerator.generate();
            if (!urlRepository.existsByShortCode(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Unable to generate a unique short code. Please try again.");
    }

    private String validateAndNormalizeUrl(String rawUrl) {
        if (rawUrl == null || rawUrl.isBlank()) {
            throw new IllegalArgumentException("Original URL is required");
        }

        String trimmed = rawUrl.trim();
        try {
            URI uri = new URI(trimmed);
            String scheme = uri.getScheme();
            if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                throw new IllegalArgumentException("URL must start with http:// or https://");
            }

            String host = uri.getHost();
            if (host == null || host.isBlank()) {
                throw new IllegalArgumentException("URL must contain a valid host");
            }

            if (!host.equalsIgnoreCase("localhost") && !host.contains(".")) {
                throw new IllegalArgumentException("URL must contain a valid domain name");
            }

            if (host.startsWith(".") || host.endsWith(".")) {
                throw new IllegalArgumentException("URL must contain a valid domain name");
            }

            // Ensure java.net.URL also accepts the structure (e.g., valid port)
            uri.toURL();
            return trimmed;
        } catch (URISyntaxException | MalformedURLException ex) {
            throw new IllegalArgumentException("Please enter a valid URL (e.g., https://example.com)");
        }
    }

    private UrlResponse toResponse(Url url) {
        return UrlResponse.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortCode(url.getShortCode())
                .shortUrl(baseUrl + "/" + url.getShortCode())
                .clickCount(url.getClickCount())
                .createdAt(url.getCreatedAt())
                .build();
    }
}
