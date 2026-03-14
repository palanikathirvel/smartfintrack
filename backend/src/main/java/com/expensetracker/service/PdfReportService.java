package com.expensetracker.service;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PdfReportService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public byte[] generateTaxAuditPdf(String userId) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font styles
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, BaseColor.BLACK);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.DARK_GRAY);
            Font tableHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE);

            // Title
            Paragraph title = new Paragraph("SmartFinance - Official Tax & Audit Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph datePar = new Paragraph("Generated on: " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")), subtitleFont);
            datePar.setAlignment(Element.ALIGN_CENTER);
            datePar.setSpacingAfter(20);
            document.add(datePar);

            // Get Data
            List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(userId);

            // Categorize into Tax Deductible vs Non-Deductible
            List<Expense> deductible = expenses.stream()
                .filter(e -> List.of("Health", "Education", "Work", "Charity", "Business").contains(e.getCategory()))
                .collect(Collectors.toList());

            List<Expense> standard = expenses.stream()
                .filter(e -> !List.of("Health", "Education", "Work", "Charity", "Business").contains(e.getCategory()))
                .collect(Collectors.toList());

            double totalDeductible = deductible.stream().mapToDouble(Expense::getAmount).sum();
            double totalStandard = standard.stream().mapToDouble(Expense::getAmount).sum();

            // Summary Table
            document.add(new Paragraph("Financial Summary", subtitleFont));
            document.add(new Paragraph("Total Standard Expenses: INR " + String.format("%.2f", totalStandard)));
            document.add(new Paragraph("Total Potentially Tax Deductible Expenses: INR " + String.format("%.2f", totalDeductible)));
            document.add(new Paragraph(" "));

            // Deductible Table Breakdown
            if (!deductible.isEmpty()) {
                document.add(new Paragraph("Itemized Deductible Expenses", subtitleFont));
                PdfPTable table = new PdfPTable(3);
                table.setWidthPercentage(100);
                table.setSpacingBefore(10f);
                table.setSpacingAfter(20f);

                PdfPCell c1 = new PdfPCell(new Phrase("Date", tableHeader));
                c1.setBackgroundColor(BaseColor.GRAY);
                table.addCell(c1);

                PdfPCell c2 = new PdfPCell(new Phrase("Description & Category", tableHeader));
                c2.setBackgroundColor(BaseColor.GRAY);
                table.addCell(c2);

                PdfPCell c3 = new PdfPCell(new Phrase("Amount (INR)", tableHeader));
                c3.setBackgroundColor(BaseColor.GRAY);
                table.addCell(c3);

                for (Expense e : deductible) {
                    table.addCell(e.getDate().toString());
                    table.addCell(e.getDescription() + " (" + e.getCategory() + ")");
                    table.addCell(String.valueOf(e.getAmount()));
                }
                document.add(table);
            }

            // Disclaimer
            Paragraph disclaimer = new Paragraph("Disclaimer: This report is generated automatically by SmartFinance's backend heuristics and is intended for personal auditing purposes ONLY. Please consult a licensed tax professional before filing taxes.", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10));
            disclaimer.setSpacingBefore(30);
            document.add(disclaimer);

            document.close();
        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return out.toByteArray();
    }
}
