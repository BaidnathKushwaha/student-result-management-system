package com.resultmanagement.controller;

import com.resultmanagement.dto.request.MarksRequest;
import com.resultmanagement.dto.response.MarksResponse;
import com.resultmanagement.service.MarksService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty/marks")
@RequiredArgsConstructor
@Tag(name = "Marks", description = "Faculty endpoints for entering and updating student marks")
public class MarksController {

    private final MarksService marksService;

    @PostMapping
    public ResponseEntity<MarksResponse> addMarks(@Valid @RequestBody MarksRequest request) {
        return new ResponseEntity<>(marksService.addMarks(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarksResponse> updateMarks(@PathVariable Long id, @Valid @RequestBody MarksRequest request) {
        return ResponseEntity.ok(marksService.updateMarks(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarksResponse> getMarksById(@PathVariable Long id) {
        return ResponseEntity.ok(marksService.getMarksById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<MarksResponse>> getMarksByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(marksService.getMarksByStudent(studentId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarks(@PathVariable Long id) {
        marksService.deleteMarks(id);
        return ResponseEntity.noContent().build();
    }
}
