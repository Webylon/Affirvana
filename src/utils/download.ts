import { jsPDF } from 'jspdf';
import { LuxuryItem } from '../types';

export const downloadImage = async (item: LuxuryItem) => {
  try {
    const response = await fetch(item.image);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image. Please try again.');
  }
};

interface InvoiceItem {
  title: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  id: string;
  date: string;
  items: InvoiceItem[];
  total: number;
}

export const generateInvoicePDF = (invoice: InvoiceData) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text(`Invoice #${invoice.id.slice(0, 8)}`, 10, 20);

  // Add date
  doc.setFontSize(12);
  doc.text(`Date: ${invoice.date}`, 10, 30);

  // Add items table header
  doc.setFontSize(12);
  doc.text('Item', 10, 40);
  doc.text('Quantity', 80, 40);
  doc.text('Price', 120, 40);

  let y = 50;
  invoice.items.forEach((item) => {
    doc.setFontSize(10);
    doc.text(item.title, 10, y);
    doc.text(item.quantity.toString(), 80, y);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 120, y);
    y += 10;
  });

  // Add total
  doc.setFontSize(14);
  doc.text(`Total: $${invoice.total.toFixed(2)}`, 10, y + 10);

  // Download the PDF
  doc.save(`invoice-${invoice.id.slice(0, 8)}.pdf`);
};
