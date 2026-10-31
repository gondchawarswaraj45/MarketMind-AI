package com.marketmind.auth;

import com.marketmind.auth.dto.AuthResponse;
import com.marketmind.auth.dto.LoginRequest;
import com.marketmind.auth.dto.RegisterRequest;
import com.marketmind.auth.model.Role;
import com.marketmind.auth.model.User;
import com.marketmind.auth.repository.UserRepository;
import com.marketmind.auth.security.JwtService;
import com.marketmind.auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authService = new AuthService(userRepository, passwordEncoder, jwtService, authenticationManager);
    }

    @Test
    void register_ShouldSaveUserAndReturnAuthResponse() {
        RegisterRequest req = new RegisterRequest("test@marketmind.ai", "password123", "Test User");

        when(userRepository.existsByEmail("test@marketmind.ai")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        User savedUser = new User("test@marketmind.ai", "encodedPassword", "Test User", Role.ROLE_USER);
        savedUser.setId("u-123");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(savedUser)).thenReturn("jwt.token.here");

        AuthResponse res = authService.register(req);

        assertNotNull(res);
        assertEquals("test@marketmind.ai", res.getEmail());
        assertEquals("jwt.token.here", res.getToken());
        assertEquals("ROLE_USER", res.getRole());
    }

    @Test
    void register_WhenEmailExists_ShouldThrowException() {
        RegisterRequest req = new RegisterRequest("existing@marketmind.ai", "password123", "User");
        when(userRepository.existsByEmail("existing@marketmind.ai")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(req));
    }

    @Test
    void login_WithValidCredentials_ShouldReturnToken() {
        LoginRequest req = new LoginRequest("user@marketmind.ai", "password123");
        User user = new User("user@marketmind.ai", "hashed", "User", Role.ROLE_USER);
        user.setId("u-1");

        when(userRepository.findByEmail("user@marketmind.ai")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("valid.jwt");

        AuthResponse res = authService.login(req);

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        assertNotNull(res);
        assertEquals("valid.jwt", res.getToken());
    }
}

