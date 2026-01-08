export const calculateSurvivalRate = (initial, current) => {
    const initialNum = parseFloat(initial);
    const currentNum = parseFloat(current);
    
    if (current === "" || current === null || isNaN(currentNum)) return null;
    if (!initialNum || initialNum === 0) return 0;
    
    const rate = (currentNum / initialNum) * 100;
    return parseFloat(rate.toFixed(2));
};

export const getStatusConfig = (sr) => {
    if (sr === null || sr === undefined) return { label: 'PENDING', color: '#bdc3c7' };
    
    // Thresholds as per your requirement
    if (sr >= 75) return { label: 'VERY GOOD', color: '#27ae60' };
    if (sr >= 50) return { label: 'GOOD', color: '#3498db' }; 
    if (sr >= 45) return { label: 'BAD', color: '#f39c12' };
    return { label: 'VERY BAD', color: '#e74c3c' };
};