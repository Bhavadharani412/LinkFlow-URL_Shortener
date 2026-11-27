package com.linkflow.service;

import com.linkflow.dto.UrlRequest;
import com.linkflow.dto.UrlResponse;

import java.util.List;

public interface UrlService {

    UrlResponse createShortUrl(UrlRequest request);

    List<UrlResponse> getAllUrls();

    UrlResponse getUrlByShortCode(String shortCode);

    String resolveOriginalUrl(String shortCode);

    void deleteUrl(Long id);
}
