package com.enviro.assessment.junior.nqobile;

import com.enviro.assessment.junior.nqobile.dto.WithdrawalResponse;
import com.enviro.assessment.junior.nqobile.entity.User;
import com.enviro.assessment.junior.nqobile.repository.UserRepository;
import com.enviro.assessment.junior.nqobile.repository.WithdrawalRepository;
import com.enviro.assessment.junior.nqobile.service.UserService;
import com.enviro.assessment.junior.nqobile.service.WithdrawalService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WithdrawalServiceTest {

    @Mock
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WithdrawalRepository withdrawalRepository;

    @InjectMocks
    private WithdrawalService withdrawalService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setAge(70);
        user.setBalance(5000.0);
    }

    @Test
    void processWithdrawal_success() {
        when(userService.findUserById(1L)).thenReturn(user);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(withdrawalRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        WithdrawalResponse response = withdrawalService.processWithdrawal(1L, 500.0);

        assertEquals("Withdrawal successful", response.getMessage());
        assertEquals(4500.0, response.getRemainingBalance());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void processWithdrawal_deniedWhenUnderAge() {
        user.setAge(30);
        when(userService.findUserById(1L)).thenReturn(user);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> withdrawalService.processWithdrawal(1L, 500.0));

        assertTrue(ex.getMessage().contains("at least 65"));
    }

    @Test
    void processWithdrawal_allowedAtAge65() {
        user.setAge(65);
        when(userService.findUserById(1L)).thenReturn(user);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(withdrawalRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        WithdrawalResponse response = withdrawalService.processWithdrawal(1L, 500.0);

        assertEquals("Withdrawal successful", response.getMessage());
        assertEquals(4500.0, response.getRemainingBalance());
    }

    @Test
    void processWithdrawal_deniedWhenInsufficientBalance() {
        when(userService.findUserById(1L)).thenReturn(user);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> withdrawalService.processWithdrawal(1L, 6000.0));

        assertTrue(ex.getMessage().contains("Insufficient balance"));
    }

    @Test
    void processWithdrawal_deniedWhenExceeds90Percent() {
        when(userService.findUserById(1L)).thenReturn(user);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> withdrawalService.processWithdrawal(1L, 4600.0));

        assertTrue(ex.getMessage().contains("90%"));
    }
}
