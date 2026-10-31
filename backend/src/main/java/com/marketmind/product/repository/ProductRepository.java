package com.marketmind.product.repository;

import com.marketmind.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Product> findByIdAndUserId(String id, String userId);
}

