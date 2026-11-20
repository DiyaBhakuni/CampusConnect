package com.bits.campusmanagement;

import com.bits.campusmanagement.dto.LoginRequest;
import com.bits.campusmanagement.model.Role;
import com.bits.campusmanagement.model.User;
import com.bits.campusmanagement.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        if (!userRepository.existsByEmail("testadmin@campus.edu")) {
            userRepository.save(User.builder()
                    .email("testadmin@campus.edu")
                    .password(passwordEncoder.encode("test123"))
                    .fullName("Test Admin")
                    .role(Role.ROLE_ADMIN)
                    .build());
        }
    }

    @Test
    void loginWithValidCredentials_returnsToken() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("testadmin@campus.edu");
        req.setPassword("test123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"));
    }

    @Test
    void loginWithInvalidCredentials_returnsUnauthorized() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("testadmin@campus.edu");
        req.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginWithInvalidEmail_returnsBadRequest() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("not-an-email");
        req.setPassword("test123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void adminEndpoint_withoutToken_returnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/students"))
                .andExpect(status().isUnauthorized());
    }
}
