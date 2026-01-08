import React, { useState, useEffect } from 'react';

const MaintenanceForm = ({ onDataSubmit, editData }) => {
    const [formData, setFormData] = useState({
        siteName: '', installDate: '', initialFragments: '', reefStars: '',
        m2: '', m4: '', m6: '', m8: '', m12: '',
        d2: '', d4: '', d6: '', d8: '', d12: '', notes: ''
    });

    useEffect(() => {
        if (editData) setFormData(editData);
        else setFormData({ siteName: '', installDate: '', initialFragments: '', reefStars: '', m2: '', m4: '', m6: '', m8: '', m12: '', d2: '', d4: '', d6: '', d8: '', d12: '', notes: '' });
    }, [editData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onDataSubmit(formData); }} style={styles.form}>
            <div style={styles.row}>
                <div style={styles.field}><label>Site Name</label>
                <input name="siteName" value={formData.siteName} onChange={handleChange} required style={styles.input} /></div>
                <div style={styles.field}><label>Installation Date</label>
                <input name="installDate" type="date" value={formData.installDate} onChange={handleChange} required style={styles.input} /></div>
            </div>
            
            <div style={styles.row}>
                <div style={styles.field}><label>Total Fragments</label>
                <input name="initialFragments" type="number" value={formData.initialFragments} onChange={handleChange} required style={styles.input} /></div>
                <div style={styles.field}><label>Total Reef Stars</label>
                <input name="reefStars" type="number" value={formData.reefStars} onChange={handleChange} placeholder="e.g. 50" style={styles.input} /></div>
            </div>
            
            <p style={{ fontWeight: 'bold', margin: '15px 0 5px' }}>Maintenance Schedule (Date & Alive Count):</p>
            <div style={styles.grid}>
                {['2', '4', '6', '8', '12'].map((w) => (
                    <div key={w} style={styles.weekBox}>
                        <label style={{fontSize:'11px', fontWeight:'bold'}}>WEEK {w}</label>
                        <input name={`d${w}`} type="date" value={formData[`d${w}`]} onChange={handleChange} style={styles.inputDate} />
                        <input name={`m${w}`} type="number" placeholder="Count" value={formData[`m${w}`]} onChange={handleChange} style={styles.inputWeek} />
                    </div>
                ))}
            </div>

            <div style={{...styles.field, marginTop: '10px'}}>
                <label>Field Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} style={{...styles.input, height: '60px'}} />
            </div>
            <button type="submit" style={styles.button}>{editData ? 'UPDATE SITE DATA' : 'SAVE SITE'}</button>
        </form>
    );
};

const styles = {
    form: { display: 'flex', flexDirection: 'column', gap: '8px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
    field: { display: 'flex', flexDirection: 'column', gap: '3px' },
    grid: { display: 'flex', gap: '5px' },
    weekBox: { flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', background: '#f4f7f6', padding: '5px', borderRadius: '5px' },
    input: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc' },
    inputDate: { padding: '4px', fontSize: '10px', borderRadius: '3px', border: '1px solid #ddd' },
    inputWeek: { padding: '6px', textAlign: 'center', borderRadius: '3px', border: '1px solid #ccc' },
    button: { padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }
};

export default MaintenanceForm;