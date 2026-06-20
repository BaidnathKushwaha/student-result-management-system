package com.resultmanagement.service;

import com.resultmanagement.entity.Role;
import com.resultmanagement.exception.ResourceNotFoundException;
import com.resultmanagement.repository.StudentRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.resultmanagement.dto.request.LoginRequest;
import com.resultmanagement.dto.request.RegisterRequest;
import com.resultmanagement.dto.response.AuthResponse;
import com.resultmanagement.entity.User;
import com.resultmanagement.exception.DuplicateResourceException;
import com.resultmanagement.repository.UserRepository;
import com.resultmanagement.security.CustomUserDetails;
import com.resultmanagement.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final StudentRepository studentRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;

        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new DuplicateResourceException(
                                        "Username '" + request.getUsername() + "' is already taken");
                }

                if (request.getReferenceId() != null && userRepository.existsByReferenceIdAndRole(request.getReferenceId(), request.getRole())) {
                        throw new DuplicateResourceException("Profile already linked to another account");
                }

                if (request.getRole() == Role.STUDENT) {
                        if (request.getReferenceId() == null) {
                                throw new DuplicateResourceException("referenceId is required for STUDENT");
                        }
                        studentRepository.findById(request.getReferenceId())
                                        .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                }

                User user = User.builder()
                                .username(request.getUsername())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole())
                                .referenceId(request.getReferenceId())
                                .build();

                userRepository.save(user);

                CustomUserDetails userDetails = new CustomUserDetails(user);
                String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

                return AuthResponse.builder()
                                .token(token)
                                .username(user.getUsername())
                                .role(user.getRole().name())
                                .referenceId(user.getReferenceId())
                                .build();
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

                User user = userRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                CustomUserDetails userDetails = new CustomUserDetails(user);
                String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

                return AuthResponse.builder()
                                .token(token)
                                .username(user.getUsername())
                                .role(user.getRole().name())
                                .referenceId(user.getReferenceId())
                                .build();
        }
}
