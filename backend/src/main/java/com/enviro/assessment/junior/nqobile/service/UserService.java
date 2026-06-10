package com.enviro.assessment.junior.nqobile.service;

import com.enviro.assessment.junior.nqobile.dto.UpdateUserRequest;
import com.enviro.assessment.junior.nqobile.dto.UserProfileDTO;
import com.enviro.assessment.junior.nqobile.entity.User;
import com.enviro.assessment.junior.nqobile.exception.ResourceNotFoundException;
import com.enviro.assessment.junior.nqobile.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileDTO getProfile(Long userId) {
        User user = findUserById(userId);
        return toProfileDTO(user);
    }

    public UserProfileDTO updateUser(Long userId, UpdateUserRequest request) {
        User user = findUserById(userId);

        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }
        if (request.getBalance() != null) {
            user.setBalance(request.getBalance());
        }

        user = userRepository.save(user);
        log.info("Updated user profile for id: {}, age: {}, balance: {}", userId, user.getAge(), user.getBalance());

        return toProfileDTO(user);
    }

    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private UserProfileDTO toProfileDTO(User user) {
        return new UserProfileDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getAge(),
                user.getBalance(),
                user.getRole()
        );
    }
}
