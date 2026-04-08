package portfolio_tracker;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fundName;
    private String schemeCode;
    private double amount;
    private double units;   // ✅ ADD THIS

    public Long getId() { return id; }

    public String getFundName() { return fundName; }
    public void setFundName(String fundName) { this.fundName = fundName; }
    public String getSchemeCode() { return schemeCode; }
public void setSchemeCode(String schemeCode) { this.schemeCode = schemeCode; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public double getUnits() { return units; }
    public void setUnits(double units) { this.units = units; }
}