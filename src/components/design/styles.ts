export const designStyles = {
  root: {
    backgroundColor: '#EBE8E3',
    color: '#1A1A1A',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '13px',
    lineHeight: '1.4',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    WebkitFontSmoothing: 'antialiased',
  },
  appHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '16px 24px',
    borderBottom: '1px solid #D4D1C9',
    flexShrink: 0,
  },
  appHeaderLeft: { display: 'flex', alignItems: 'baseline', gap: '16px' },
  appHeaderH1: { fontSize: '16px', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 },
  appHeaderNav: { display: 'flex', gap: '16px' },
  appMain: { display: 'flex', flex: 1, overflow: 'hidden' },
  paneLeft: {
    flex: 55,
    overflowY: 'auto',
    padding: '32px',
    borderRight: '1px solid #D4D1C9',
  },
  paneRight: {
    flex: 45,
    overflowY: 'auto',
    padding: '32px',
    backgroundColor: '#EBE8E3',
  },
  section: {
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid #D4D1C9',
  },
  sectionLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: 'none',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#1A1A1A',
    letterSpacing: '0.02em',
    margin: 0,
  },
  sectionActions: { display: 'flex', gap: '8px', alignItems: 'center' },
  grid2x2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    color: '#6B6861',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    background: 'transparent',
    border: '1px solid #D4D1C9',
    borderRadius: '0px',
    color: '#1A1A1A',
    padding: '8px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '13px',
    appearance: 'none',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    background: 'transparent',
    border: '1px solid #D4D1C9',
    borderRadius: '0px',
    color: '#1A1A1A',
    padding: '8px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '13px',
    appearance: 'none',
    outline: 'none',
    width: '100%',
  },
  selectSmall: {
    background: 'transparent',
    border: '1px solid #D4D1C9',
    borderRadius: '0px',
    color: '#1A1A1A',
    padding: '2px 6px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '11px',
    appearance: 'none',
    outline: 'none',
    width: 'auto',
  },
  targetDistRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    marginBottom: '8px',
  },
  targetDistField: { flex: 1 },
  targetSum: {
    fontSize: '11px',
    color: '#6B6861',
    padding: '8px 0',
    whiteSpace: 'nowrap',
  },
  itemListHeader: {
    display: 'grid',
    gridTemplateColumns: '40px 100px 100px 60px 1fr 60px',
    gap: '8px',
    paddingBottom: '8px',
    borderBottom: '1px solid #D4D1C9',
    fontSize: '11px',
    color: '#6B6861',
    marginBottom: '8px',
  },
  itemRow: {
    display: 'grid',
    gridTemplateColumns: '40px 100px 100px 60px 1fr 60px',
    gap: '8px',
    alignItems: 'center',
    padding: '4px 0',
    borderBottom: '1px solid transparent',
  },
  cellId: { fontSize: '11px', color: '#6B6861' },
  rowActions: { display: 'flex', gap: '4px', opacity: 0.3, transition: 'opacity 0.2s' },
  rowActionsHover: { display: 'flex', gap: '4px', opacity: 1, transition: 'opacity 0.2s' },
  sliderContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
  sliderValue: { fontSize: '11px', width: '30px', textAlign: 'right' },
  button: {
    background: 'transparent',
    border: '1px solid #D4D1C9',
    color: '#1A1A1A',
    borderRadius: '0px',
    padding: '6px 12px',
    fontSize: '11px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    cursor: 'pointer',
  },
  btnText: {
    background: 'transparent',
    border: 'none',
    padding: '0',
    color: '#6B6861',
    fontSize: '11px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    cursor: 'pointer',
  },
  btnPrimary: {
    display: 'block',
    width: '100%',
    backgroundColor: '#1A1A1A',
    color: '#EBE8E3',
    border: 'none',
    padding: '16px',
    fontSize: '14px',
    fontWeight: 500,
    marginTop: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  cutScoresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginTop: '8px',
  },
  scoreCard: {
    border: '1px solid #D4D1C9',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  scoreLabel: { fontSize: '11px', color: '#6B6861', marginBottom: '4px' },
  scoreValue: { fontSize: '18px', fontWeight: 500 },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '11px',
    marginBottom: '16px',
  },
  th: {
    border: '1px solid #D4D1C9',
    padding: '6px 8px',
    textAlign: 'center',
    fontWeight: 'normal',
    color: '#6B6861',
  },
  td: {
    border: '1px solid #D4D1C9',
    padding: '6px 8px',
    textAlign: 'right',
  },
  tdCenter: {
    border: '1px solid #D4D1C9',
    padding: '6px 8px',
    textAlign: 'center',
  },
  tdLeft: {
    border: '1px solid #D4D1C9',
    padding: '6px 8px',
    textAlign: 'left',
  },
  alertList: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
  alertError: {
    padding: '8px 16px',
    fontSize: '13px',
    border: '1px solid #1A1A1A',
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: '#1A1A1A',
    color: '#EBE8E3',
  },
  alertWarning: {
    padding: '8px 16px',
    fontSize: '13px',
    border: '1px solid #1A1A1A',
    display: 'flex',
    alignItems: 'flex-start',
    color: '#1A1A1A',
  },
  alertInfo: {
    padding: '8px 16px',
    fontSize: '13px',
    border: '1px solid #D4D1C9',
    display: 'flex',
    alignItems: 'flex-start',
    color: '#6B6861',
  },
  inlineWarning: {
    fontSize: '11px',
    color: '#1A1A1A',
    borderLeft: '2px solid #1A1A1A',
    paddingLeft: '8px',
    marginTop: '8px',
  },
  textMuted: { color: '#6B6861' },
  textSmall: { fontSize: '11px' },
  navLink: {
    color: '#6B6861',
    textDecoration: 'none',
    fontSize: '11px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    padding: 0,
  },
};

export const globalDesignCSS = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        background: transparent;
        padding: 0;
        border: none;
        outline: none;
      }
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 12px;
        width: 6px;
        background: #1A1A1A;
        cursor: pointer;
        margin-top: -5px;
        border-radius: 0px;
      }
      input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 1px;
        cursor: pointer;
        background: #D4D1C9;
      }
      input:focus { border-color: #1A1A1A !important; }
      select:focus { border-color: #1A1A1A !important; }
      button.btn-primary-hover:hover { opacity: 0.9; }
    `;
