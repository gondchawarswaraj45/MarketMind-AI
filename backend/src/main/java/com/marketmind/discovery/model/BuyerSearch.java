package com.marketmind.discovery.model;

import com.marketmind.common.entity.BaseEntity;
import com.marketmind.product.model.Product;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "buyer_searches")
public class BuyerSearch extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "query_context")
    private String queryContext;

    @Column(name = "search_status")
    private String searchStatus = "COMPLETED";

    @Column(name = "is_live_tavily")
    private Boolean isLiveTavily = true;

    @OneToMany(mappedBy = "search", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Lead> leads = new ArrayList<>();

    public BuyerSearch() {}

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getQueryContext() { return queryContext; }
    public void setQueryContext(String queryContext) { this.queryContext = queryContext; }

    public String getSearchStatus() { return searchStatus; }
    public void setSearchStatus(String searchStatus) { this.searchStatus = searchStatus; }

    public Boolean getIsLiveTavily() { return isLiveTavily; }
    public void setIsLiveTavily(Boolean isLiveTavily) { this.isLiveTavily = isLiveTavily; }

    public List<Lead> getLeads() { return leads; }
    public void setLeads(List<Lead> leads) { this.leads = leads; }
}

