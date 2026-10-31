package com.marketmind.discovery.repository;

import com.marketmind.discovery.model.BuyerSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuyerSearchRepository extends JpaRepository<BuyerSearch, String> {
    List<BuyerSearch> findByProductIdOrderByCreatedAtDesc(String productId);
}

