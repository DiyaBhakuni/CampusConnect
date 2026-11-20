package com.bits.campusmanagement;

import com.bits.campusmanagement.config.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret",
                "campusinfo-secret-key-must-be-at-least-256-bits-long-for-hs256");
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationMs", 86400000L);
    }

    @Test
    void generateAndValidateToken_success() {
        String token = jwtTokenProvider.generateToken("user@test.com");

        assertThat(token).isNotBlank();
        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
    }

    @Test
    void getEmailFromToken_returnsCorrectEmail() {
        String email = "faculty@campus.edu";
        String token = jwtTokenProvider.generateToken(email);

        assertThat(jwtTokenProvider.getEmailFromToken(token)).isEqualTo(email);
    }

    @Test
    void validateToken_withTamperedToken_returnsFalse() {
        String token = jwtTokenProvider.generateToken("user@test.com");
        String tampered = token.substring(0, token.length() - 5) + "XXXXX";

        assertThat(jwtTokenProvider.validateToken(tampered)).isFalse();
    }

    @Test
    void validateToken_withGarbageInput_returnsFalse() {
        assertThat(jwtTokenProvider.validateToken("not.a.jwt")).isFalse();
    }

    @Test
    void validateToken_withEmptyString_returnsFalse() {
        assertThat(jwtTokenProvider.validateToken("")).isFalse();
    }
}
