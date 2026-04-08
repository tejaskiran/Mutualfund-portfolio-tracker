package portfolio_tracker;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PortfolioController {

    private final PortfolioRepository repo;

    public PortfolioController(PortfolioRepository repo) {
        this.repo = repo;
    }

    private double getNav(String schemeCode) {
    try {
        String url = "https://api.mfapi.in/mf/" + schemeCode;

        RestTemplate restTemplate = new RestTemplate();
        Map response = restTemplate.getForObject(url, Map.class);

        List data = (List) response.get("data");
        Map latest = (Map) data.get(0);

        return Double.parseDouble((String) latest.get("nav"));

    } catch (Exception e) {
        return 0;
    }
}

    @GetMapping
    public String home() {
        return "Portfolio Tracker API Running 🚀";
    }

    @PostMapping("/add")
    public Portfolio add(@RequestBody Portfolio portfolio) {
        return repo.save(portfolio);
    }

    @GetMapping("/all")
public List<Map<String, Object>> getAll() {
    return repo.findAll()
        .stream()
        .map(p -> {
            double nav = getNav(p.getSchemeCode());
            double currentValue = p.getUnits() * nav;
            double profit = currentValue - p.getAmount();

            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("fundName", p.getFundName());
            map.put("amount", p.getAmount());
            map.put("units", p.getUnits());
            map.put("schemeCode", p.getSchemeCode());
            map.put("nav", nav);
            map.put("currentValue", currentValue);
            map.put("profit", profit);

            return map;
        })
        .toList();
}

    @GetMapping("/total")
    public Map<String, Double> totalInvestment() {
    double total = repo.findAll()
            .stream()
            .mapToDouble(Portfolio::getAmount)
            .sum();

    return Map.of("totalInvestment", total);
    }

    @GetMapping("/current-value")
    public double currentValue() {

        return repo.findAll()
            .stream()
            .mapToDouble(p -> p.getUnits() * getNav(p.getSchemeCode()))
            .sum();
    }

    @GetMapping("/profit")
public double profit() {
    double current = repo.findAll()
        .stream()
        .mapToDouble(p -> p.getUnits() * getNav(p.getSchemeCode()))
        .sum();

    double invested = repo.findAll()
        .stream()
        .mapToDouble(Portfolio::getAmount)
        .sum();

    return current - invested;
}

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
    repo.deleteById(id);
    }

    @PutMapping("/update/{id}")
    public Portfolio update(@PathVariable Long id, @RequestBody Portfolio p) {
    Portfolio existing = repo.findById(id).orElseThrow();
    existing.setFundName(p.getFundName());
    existing.setAmount(p.getAmount());
    existing.setUnits(p.getUnits());
    return repo.save(existing);
    }
}