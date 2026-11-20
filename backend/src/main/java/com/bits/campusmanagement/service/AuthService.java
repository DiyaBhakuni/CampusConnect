package com.bits.campusmanagement.service;

import com.bits.campusmanagement.dto.ChangePasswordRequest;
import com.bits.campusmanagement.dto.LoginRequest;
import com.bits.campusmanagement.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);
}
