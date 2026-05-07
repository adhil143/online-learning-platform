package com.example.learningplatform.controller;

import com.example.learningplatform.entity.Enrollment;
import com.example.learningplatform.repository.EnrollmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
@CrossOrigin("*")
public class EnrollmentController {

    private final EnrollmentRepository repository;

    public EnrollmentController(EnrollmentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return repository.findAll();
    }

    @PostMapping
    public Enrollment createEnrollment(@RequestBody Enrollment enrollment) {
        return repository.save(enrollment);
    }
}