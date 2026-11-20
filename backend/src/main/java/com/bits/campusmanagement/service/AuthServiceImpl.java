package com.bits.campusmanagement.service;

import com.bits.campusmanagement.config.JwtTokenProvider;
import com.bits.campusmanagement.dto.ChangePasswordRequest;
import com.bits.campusmanagement.dto.LoginRequest;
import com.bits.campusmanagement.dto.LoginResponse;
import com.bits.campusmanagement.model.Faculty;
import com.bits.campusmanagement.model.Role;
import com.bits.campusmanagement.model.Student;
import com.bits.campusmanagement.model.User;
import com.bits.campusmanagement.repository.FacultyRepository;
import com.bits.campusmanagement.repository.StudentRepository;
import com.bits.campusmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = (User) auth.getPrincipal();
        String token = jwtTokenProvider.generateToken(auth);

        Long profileId = null;
        if (user.getRole() == Role.ROLE_STUDENT) {
            profileId = studentRepository.findByUserId(user.getId()).map(Student::getId).orElse(null);
        } else if (user.getRole() == Role.ROLE_FACULTY) {
            profileId = facultyRepository.findByUserId(user.getId()).map(Faculty::getId).orElse(null);
        }

        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .profileId(profileId)
                .build();
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
