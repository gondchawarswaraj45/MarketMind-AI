package com.marketmind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.File;

@SpringBootApplication
public class MarketMindApplication {

    static {
        // Ensure data directory for SQLite exists across both main run and test runs
        File dataDir = new File("data");
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(MarketMindApplication.class, args);
    }
}
