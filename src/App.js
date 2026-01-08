import React, { useState, useEffect } from 'react';
import MaintenanceForm from './components/MaintenanceForm';
import SurvivalChart from './components/SurvivalChart';
import { calculateSurvivalRate, getStatusConfig } from './logic/calculations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function App() {
  const [allSites, setAllSites] = useState([]);
  const [activeSiteIndex, setActiveSiteIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState('single');

  useEffect(() => {
    const saved = localStorage.getItem('coral_master_v5');
    if (saved) setAllSites(JSON.parse(saved));
  }, []);

  const handleDataSubmit = (formData) => {
    const initial = parseFloat(formData.initialFragments);
    const rates = ['m2', 'm4', 'm6', 'm8', 'm12'].map(w => calculateSurvivalRate(initial, formData[w]));
    
    const validRates = rates.filter(r => r !== null);
    const currentSR = validRates.length > 0 ? validRates[validRates.length - 1] : 0;

    const newSite = { ...formData, chartRates: rates, currentSR };
    let updated = activeSiteIndex !== null ? [...allSites] : [...allSites, newSite];
    if (activeSiteIndex !== null) updated[activeSiteIndex] = newSite;
    
    setAllSites(updated);
    localStorage.setItem('coral_master_v5', JSON.stringify(updated));
    setActiveSiteIndex(updated.length - 1);
    setIsEditing(false);
  };

  const handleDeleteSite = (index) => {
    if (window.confirm(`Delete site "${allSites[index].siteName}" permanently?`)) {
      const updated = allSites.filter((_, i) => i !== index);
      setAllSites(updated);
      localStorage.setItem('coral_master_v5', JSON.stringify(updated));
      setActiveSiteIndex(null);
    }
  };

  const exportPDF = (elementId, title) => {
    const input = document.getElementById(elementId);
    html2canvas(input, { scale: 2 }).then(canvas => {
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.text(title, 15, 15);
      pdf.addImage(img, 'PNG', 10, 25, 190, (canvas.height * 190) / canvas.width);
      pdf.save(`${title}.pdf`);
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', color: '#2c3e50' }}>
      <header style={styles.header}>
        <div>
          <h1 style={{margin:0}}>Maintenance Report</h1>
          <div style={{marginTop: '10px'}}>
            <button onClick={() => setViewMode('single')} style={viewMode === 'single' ? styles.activeTab : styles.tab}>Individual View</button>
            <button onClick={() => setViewMode('all')} style={viewMode === 'all' ? styles.activeTab : styles.tab}>Global Summary</button>
          </div>
        </div>
        <button onClick={() => { setActiveSiteIndex(null); setIsEditing(true); setViewMode('single'); }} style={styles.newBtn}>+ NEW SITE</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' }}>
        <aside style={styles.sidebar}>
          <h3>Site List</h3>
          {allSites.map((site, i) => (
            <div key={i} onClick={() => { setActiveSiteIndex(i); setIsEditing(false); setViewMode('single'); }} 
                 style={{ ...styles.siteItem, background: (activeSiteIndex === i && viewMode==='single') ? '#fff' : 'transparent', borderLeft: activeSiteIndex === i ? '5px solid #3498db' : 'none' }}>
              <strong>{site.siteName}</strong><br/><small>SR: {site.currentSR}%</small>
            </div>
          ))}
        </aside>

        <main>
          {viewMode === 'all' ? (
            <div id="global-report" style={styles.card}>
              <h2>Global Comparison</h2>
              <div style={{ height: '400px', margin: '20px 0' }}>
                <SurvivalChart isGlobal={true} allSites={allSites} />
              </div>
              <button onClick={() => exportPDF('global-report', 'Project_Summary')} style={styles.pdfBtn}>Export All Data</button>
            </div>
          ) : (
            isEditing || activeSiteIndex === null ? (
              <div style={styles.card}>
                <h2>{activeSiteIndex !== null ? `Edit Site` : 'New Site Registration'}</h2>
                <MaintenanceForm onDataSubmit={handleDataSubmit} editData={activeSiteIndex !== null ? allSites[activeSiteIndex] : null} />
              </div>
            ) : (
              <div id="report-area" style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h2>{allSites[activeSiteIndex].siteName}</h2>
                  <div>
                    <button onClick={() => setIsEditing(true)} style={styles.editBtn}>Edit Data</button>
                    <button onClick={() => exportPDF('report-area', `Report_${allSites[activeSiteIndex].siteName}`)} style={styles.pdfBtn}>Export PDF</button>
                  </div>
                </div>

                <div style={styles.gridStats}>
                  <div style={styles.statCard}><strong>Initial Fragments</strong><br/>{allSites[activeSiteIndex].initialFragments}</div>
                  <div style={styles.statCard}><strong>Reef Stars</strong><br/>{allSites[activeSiteIndex].reefStars || '-'}</div>
                  <div style={{ ...styles.statCard, borderTop: `4px solid ${getStatusConfig(allSites[activeSiteIndex].currentSR).color}` }}>
                    <strong>Latest Status</strong><br/>
                    <span style={{ color: getStatusConfig(allSites[activeSiteIndex].currentSR).color, fontWeight: 'bold' }}>{getStatusConfig(allSites[activeSiteIndex].currentSR).label} ({allSites[activeSiteIndex].currentSR}%)</span>
                  </div>
                </div>

                <div style={{ height: '300px', margin: '25px 0' }}>
                  <SurvivalChart dataLogs={allSites[activeSiteIndex].chartRates} />
                </div>

                <p style={{fontWeight:'bold', marginBottom:'10px'}}>Weekly Monitoring Details:</p>
                <div style={styles.monitorGrid}>
                    {['2','4','6','8','12'].map((w, idx) => {
                        const rate = allSites[activeSiteIndex].chartRates[idx];
                        const cfg = getStatusConfig(rate);
                        return (
                            <div key={w} style={{...styles.monitorCard, borderTop: `4px solid ${rate !== null ? cfg.color : '#eee'}`}}>
                                <small style={{fontWeight:'bold'}}>WEEK {w}</small>
                                <div style={{fontSize:'10px', color:'#7f8c8d', margin:'4px 0'}}>{allSites[activeSiteIndex][`d${w}`] || 'No Date'}</div>
                                <div style={{fontSize:'18px', fontWeight:'bold'}}>{rate !== null ? `${rate}%` : '-'}</div>
                            </div>
                        );
                    })}
                </div>

                <div style={styles.notesSection}><strong>Notes:</strong><p>{allSites[activeSiteIndex].notes || "No notes available."}</p></div>

                <div style={{textAlign:'right', marginTop:'25px'}}>
                    <button onClick={() => handleDeleteSite(activeSiteIndex)} style={styles.deleteBtn}>Delete Site Permanently</button>
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '20px' },
  newBtn: { padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  sidebar: { background: '#f8f9fa', padding: '15px', borderRadius: '10px' },
  siteItem: { padding: '12px', marginBottom: '8px', borderRadius: '8px', cursor: 'pointer', transition: '0.3s' },
  card: { background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  gridStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' },
  statCard: { padding: '15px', background: '#f9f9f9', borderRadius: '8px', textAlign: 'center', border: '1px solid #eee' },
  monitorGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' },
  monitorCard: { padding: '12px', background: '#fdfdfd', borderRadius: '8px', textAlign: 'center', border: '1px solid #eee' },
  notesSection: { marginTop: '20px', padding: '15px', background: '#fdfdfd', border: '1px solid #eee', borderRadius: '8px' },
  editBtn: { background: '#f39c12', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' },
  pdfBtn: { background: '#e74c3c', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' },
  deleteBtn: { background: 'none', border: '1px solid #e74c3c', color: '#e74c3c', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' },
  tab: { padding: '8px 15px', border: 'none', background: '#eee', cursor: 'pointer', borderRadius: '5px 5px 0 0', marginRight: '5px' },
  activeTab: { padding: '8px 15px', border: 'none', background: '#3498db', color: 'white', cursor: 'pointer', borderRadius: '5px 5px 0 0', marginRight: '5px' }
};

export default App;