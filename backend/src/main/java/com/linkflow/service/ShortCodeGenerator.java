package com.linkflow.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class ShortCodeGenerator {

    private static final String ALPHANUMERIC_CHARS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private final SecureRandom secureRandom = new SecureRandom();
    private final int codeLength;

    public ShortCodeGenerator(@Value("${app.short-code.length:6}") int codeLength) {
        if (codeLength < 4 || codeLength > 20) {
            throw new IllegalArgumentException("Short code length must be between 4 and 20");
        }
        this.codeLength = codeLength;
    }

    public String generate() {
        StringBuilder builder = new StringBuilder(codeLength);
        for (int i = 0; i < codeLength; i++) {
            int index = secureRandom.nextInt(ALPHANUMERIC_CHARS.length());
            builder.append(ALPHANUMERIC_CHARS.charAt(index));
        }
        return builder.toString();
    }
}
