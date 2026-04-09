export const designStyles = {
  root: {
    backgroundColor: 'var(--design-bg)',
    color: 'var(--design-fg)',
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
    alignItems: 'flex-start',
    padding: '16px 24px',
    borderBottom: '1px solid var(--design-border)',
    flexShrink: 0,
  },
  appHeaderLeft: { display: 'flex', alignItems: 'flex-start', gap: '16px', minWidth: 0, flex: 1 },
  appHeaderH1: { fontSize: '16px', fontWeight: 500, letterSpacing: '-0.02em', margin: 0, whiteSpace: 'nowrap' },
  appHeaderNav: { display: 'flex', gap: '16px', alignItems: 'center', alignSelf: 'center', flexShrink: 0 },
  appMain: { display: 'flex', flex: 1, overflow: 'hidden' },
  paneLeft: {
    flex: 55,
    overflowY: 'auto',
    padding: '32px',
    borderRight: '1px solid var(--design-border)',
  },
  paneRight: {
    flex: 45,
    overflowY: 'auto',
    padding: '32px',
    backgroundColor: 'var(--design-bg)',
  },
  section: {
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid var(--design-border)',
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
    color: 'var(--design-fg)',
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
    color: 'var(--design-muted)',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    background: 'transparent',
    border: '1px solid var(--design-border)',
    borderRadius: '0px',
    color: 'var(--design-fg)',
    padding: '8px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '13px',
    appearance: 'none',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    background: 'transparent',
    border: '1px solid var(--design-border)',
    borderRadius: '0px',
    color: 'var(--design-fg)',
    padding: '8px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '13px',
    appearance: 'none',
    outline: 'none',
    width: '100%',
  },
  selectSmall: {
    background: 'transparent',
    border: '1px solid var(--design-border)',
    borderRadius: '0px',
    color: 'var(--design-fg)',
    padding: '4px 8px',
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
    color: 'var(--design-muted)',
    padding: '8px 0',
    whiteSpace: 'nowrap',
  },
  itemListHeader: {
    display: 'grid',
    gridTemplateColumns: '36px 90px 90px 56px 1fr 56px',
    gap: '8px',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--design-border)',
    fontSize: '11px',
    color: 'var(--design-muted)',
    marginBottom: '8px',
  },
  itemRow: {
    display: 'grid',
    gridTemplateColumns: '36px 90px 90px 56px 1fr 56px',
    gap: '8px',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid transparent',
  },
  cellId: { fontSize: '11px', color: 'var(--design-muted)' },
  rowActions: { display: 'flex', gap: '4px', opacity: 0.3, transition: 'opacity 0.2s' },
  rowActionsHover: { display: 'flex', gap: '4px', opacity: 1, transition: 'opacity 0.2s' },
  sliderContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
  sliderValue: { fontSize: '11px', width: '30px', textAlign: 'right' },
  button: {
    background: 'transparent',
    border: '1px solid var(--design-border)',
    color: 'var(--design-fg)',
    borderRadius: '0px',
    padding: '8px 12px',
    fontSize: '11px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    cursor: 'pointer',
  },
  btnText: {
    background: 'transparent',
    border: 'none',
    padding: '0',
    color: 'var(--design-muted)',
    fontSize: '11px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    cursor: 'pointer',
  },
  btnPrimary: {
    display: 'block',
    width: '100%',
    backgroundColor: 'var(--design-bg-inverted)',
    color: 'var(--design-fg-inverted)',
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
    border: '1px solid var(--design-border)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  scoreCardWarning: {
    borderColor: 'rgba(191, 87, 0, 0.65)',
    backgroundColor: 'rgba(191, 87, 0, 0.08)',
  },
  scoreCardSuccess: {
    borderColor: 'rgba(10, 122, 74, 0.55)',
    backgroundColor: 'rgba(10, 122, 74, 0.08)',
  },
  scoreLabel: { fontSize: '11px', color: 'var(--design-muted)', marginBottom: '4px' },
  scoreValue: { fontSize: '18px', fontWeight: 500 },
  scoreHint: { fontSize: '11px', color: 'var(--design-muted)', marginTop: '8px', lineHeight: '1.4' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '11px',
    marginBottom: '16px',
  },
  th: {
    border: '1px solid var(--design-border)',
    padding: '8px 10px',
    textAlign: 'center',
    fontWeight: 'normal',
    color: 'var(--design-muted)',
  },
  td: {
    border: '1px solid var(--design-border)',
    padding: '8px 10px',
    textAlign: 'right',
  },
  tdCenter: {
    border: '1px solid var(--design-border)',
    padding: '8px 10px',
    textAlign: 'center',
  },
  tdLeft: {
    border: '1px solid var(--design-border)',
    padding: '8px 10px',
    textAlign: 'left',
  },
  alertList: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
  alertError: {
    padding: '8px 16px',
    fontSize: '13px',
    border: '1px solid var(--design-bg-inverted)',
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: 'var(--design-bg-inverted)',
    color: 'var(--design-fg-inverted)',
  },
  alertWarning: {
    padding: '8px 16px',
    fontSize: '13px',
    border: '1px solid var(--design-fg)',
    display: 'flex',
    alignItems: 'flex-start',
    color: 'var(--design-fg)',
  },
  alertInfo: {
    padding: '8px 16px',
    fontSize: '13px',
    border: '1px solid var(--design-border)',
    display: 'flex',
    alignItems: 'flex-start',
    color: 'var(--design-muted)',
  },
  inlineWarning: {
    fontSize: '11px',
    color: 'var(--design-fg)',
    borderLeft: '2px solid var(--design-fg)',
    paddingLeft: '8px',
    marginTop: '8px',
  },
  inlineSuccess: {
    fontSize: '11px',
    color: 'var(--design-muted)',
    borderLeft: '2px solid rgba(10, 122, 74, 0.55)',
    paddingLeft: '8px',
    marginTop: '8px',
  },
  textMuted: { color: 'var(--design-muted)' },
  textSmall: { fontSize: '11px' },
  navLink: {
    color: 'var(--design-muted)',
    textDecoration: 'none',
    fontSize: '11px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    padding: '2px 0',
    lineHeight: 1.2,
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
        background: var(--design-fg);
        cursor: pointer;
        margin-top: -5px;
        border-radius: 0px;
      }
      input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 1px;
        cursor: pointer;
        background: var(--design-border);
      }
      input:focus { border-color: var(--design-fg) !important; }
      select:focus { border-color: var(--design-fg) !important; }
      button.btn-primary-hover:hover { opacity: 0.9; }
    `;
