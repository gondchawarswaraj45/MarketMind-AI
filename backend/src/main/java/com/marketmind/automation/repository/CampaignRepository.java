package com.marketmind.automation.repository;

import com.marketmind.automation.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, String> {
    List<Campaign> findByProductIdOrderByCreatedAtDesc(String productId);
}

