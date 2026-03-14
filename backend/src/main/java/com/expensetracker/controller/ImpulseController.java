package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.model.ImpulseItem;
import com.expensetracker.service.ImpulseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/impulses")
@CrossOrigin(origins = "*")
public class ImpulseController {

    @Autowired
    ImpulseService impulseService;

    @GetMapping("/user/{userId}")
    public List<ImpulseItem> getByUserId(@PathVariable String userId) {
        return impulseService.getItemsByUserId(userId);
    }

    @PostMapping
    public ImpulseItem create(@RequestBody ImpulseItem item) {
        return impulseService.createItem(item);
    }

    @PostMapping("/{id}/resist")
    public ImpulseItem resist(@PathVariable String id) {
        return impulseService.resistItem(id);
    }

    @PostMapping("/{id}/buy")
    public Expense buy(@PathVariable String id) {
        return impulseService.buyItem(id);
    }
}
