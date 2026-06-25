import { jsPDF } from "jspdf";

export type ReceiptData = {
  receiptNumber: string;
  donorName: string;
  donorEmail: string;
  pan?: string | null;
  amount: number;
  currency: string;
  category: string;
  frequency: string;
  date: string;
  transactionRef?: string | null;
};

export function generateReceiptPDF(d: ReceiptData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, w, 90, "F");
  doc.setTextColor(255);
  doc.setFontSize(20).setFont("helvetica", "bold");
  doc.text("ANSJ Welfare & Education Foundation", 40, 45);
  doc.setFontSize(10).setFont("helvetica", "normal");
  doc.text("80G Certified · FCRA Registered · CSR-1 Approved", 40, 65);

  // Title
  doc.setTextColor(0);
  doc.setFontSize(16).setFont("helvetica", "bold");
  doc.text("Donation Receipt", 40, 130);

  doc.setFontSize(10).setFont("helvetica", "normal");
  doc.text(`Receipt No: ${d.receiptNumber}`, 40, 155);
  doc.text(`Date: ${d.date}`, 40, 172);

  // Donor block
  doc.setDrawColor(220);
  doc.line(40, 190, w - 40, 190);
  doc.setFont("helvetica", "bold").text("Donor Details", 40, 215);
  doc.setFont("helvetica", "normal");
  doc.text(`Name:  ${d.donorName}`, 40, 235);
  doc.text(`Email: ${d.donorEmail}`, 40, 252);
  if (d.pan) doc.text(`PAN:   ${d.pan}`, 40, 269);

  // Amount block
  doc.line(40, 290, w - 40, 290);
  doc.setFont("helvetica", "bold").text("Contribution", 40, 315);
  doc.setFont("helvetica", "normal");
  doc.text(`Amount:    ${d.currency} ${d.amount.toLocaleString("en-IN")}`, 40, 335);
  doc.text(`Category:  ${d.category}`, 40, 352);
  doc.text(`Frequency: ${d.frequency}`, 40, 369);
  if (d.transactionRef) doc.text(`Txn Ref:   ${d.transactionRef}`, 40, 386);

  // Tax message
  doc.line(40, 410, w - 40, 410);
  doc.setFontSize(9);
  doc.text(
    "This donation is eligible for tax exemption under Section 80G of the Income Tax Act, 1961.",
    40,
    435,
  );
  doc.text("Registration No: AAATA1234B / 80G/2023-24", 40, 450);

  // Footer
  doc.setFontSize(8).setTextColor(120);
  doc.text(
    "ANSJ Foundation · 14 Service Lane, New Delhi · contact@ansjfoundation.org · +91 11 4000 0000",
    40,
    800,
  );

  doc.save(`ANSJ-Receipt-${d.receiptNumber}.pdf`);
}
