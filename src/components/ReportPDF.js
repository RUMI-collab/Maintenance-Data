import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = (siteName) => {
    const input = document.getElementById('report-area'); // Area yang akan difoto
    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.text(`Maintenance Report: ${siteName}`, 10, 10);
        pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
        pdf.save(`Maintenance_Report_${siteName}.pdf`);
    });
};