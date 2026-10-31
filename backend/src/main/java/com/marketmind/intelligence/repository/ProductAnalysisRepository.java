package com.marketmind.intelligence.repository;

import com.marketmind.intelligence.model.ProductAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductAnalysisRepository extends JpaRepository<ProductAnalysis, String> {
    Optional<ProductAnalysis> findByProductId(String productId);
}

