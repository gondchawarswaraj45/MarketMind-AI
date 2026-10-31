package com.marketmind.discovery.repository;

import com.marketmind.discovery.model.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, String> {
    List<Lead> findBySearchIdOrderByRelevanceScoreDesc(String searchId);
}

