package com.example.learningplatform.controller;

import com.example.learningplatform.entity.Course;
import com.example.learningplatform.repository.CourseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin("*")
public class CourseController {

    private final CourseRepository repository;

    public CourseController(CourseRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return repository.findAll();
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return repository.save(course);
    }
}