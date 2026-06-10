package com.enviro.assessment.junior.nqobile.controller;

import com.enviro.assessment.junior.nqobile.dto.UpdateUserRequest;
import com.enviro.assessment.junior.nqobile.dto.UserProfileDTO;
import com.enviro.assessment.junior.nqobile.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserProfileDTO> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(userId, request));
    }
}
