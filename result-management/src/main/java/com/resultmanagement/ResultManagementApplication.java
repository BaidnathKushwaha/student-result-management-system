package com.resultmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ResultManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResultManagementApplication.class, args);
    }

}