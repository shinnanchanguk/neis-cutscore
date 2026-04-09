import React, { useState, useEffect } from 'react';

const customStyles = {
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

const ItemRow = ({ item, index, onUpdate, onDelete, onDuplicate }) => {
  const [hovered, setHovered] = useState(false);

  const handleChange = (field, value) => {
    onUpdate(index, { ...item, [field]: value });
  };

  return (
    <div
      style={{ ...customStyles.itemRow, borderBottomColor: hovered ? '#D4D1C9' : 'transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={customStyles.cellId}>{item.id}</div>
      <select
        style={{ ...customStyles.select, padding: '4px 6px', fontSize: '11px' }}
        value={item.type}
        onChange={(e) => handleChange('type', e.target.value)}
      >
        <option>선택형</option>
        <option>서답형</option>
      </select>
      <select
        style={{ ...customStyles.select, padding: '4px 6px', fontSize: '11px' }}
        value={item.difficulty}
        onChange={(e) => handleChange('difficulty', e.target.value)}
      >
        <option>쉬움</option>
        <option>보통</option>
        <option>어려움</option>
      </select>
      <input
        type="number"
        style={{ ...customStyles.input, padding: '4px 6px', fontSize: '11px' }}
        value={item.score}
        onChange={(e) => handleChange('score', Number(e.target.value))}
      />
      <div style={customStyles.sliderContainer}>
        <input
          type="range"
          min="0"
          max="100"
          value={item.correctRate}
          style={{ width: '100%' }}
          onChange={(e) => handleChange('correctRate', Number(e.target.value))}
        />
        <span style={customStyles.sliderValue}>{item.correctRate}%</span>
      </div>
      <div style={hovered ? customStyles.rowActionsHover : customStyles.rowActions}>
        <button style={customStyles.btnText} onClick={() => onDuplicate(index)}>복제</button>
        <button style={customStyles.btnText} onClick={() => onDelete(index)}>삭제</button>
      </div>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
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
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [examInfo, setExamInfo] = useState({
    school: '',
    subject: '',
    gradesemester: '',
    examname: '',
  });

  const [preset, setPreset] = useState('프리셋: 일반고');
  const [targetDist, setTargetDist] = useState({ A: 45, B: 25, C: 15, D: 10, E: 5 });

  const [items, setItems] = useState([
    { id: 1, type: '서답형', difficulty: '쉬움', score: 4, correctRate: 95 },
    { id: 2, type: '선택형', difficulty: '보통', score: 6, correctRate: 80 },
    { id: 3, type: '선택형', difficulty: '어려움', score: 8, correctRate: 30 },
  ]);

  const [neisMode, setNeisMode] = useState('5수준(A-E) + 미도달');
  const [neisUnit, setNeisUnit] = useState('5% 단위');

  const [copied, setCopied] = useState(false);

  const totalScore = items.reduce((sum, item) => sum + item.score, 0);
  const targetSum = Object.values(targetDist).reduce((a, b) => Number(a) + Number(b), 0);

  const handleDistChange = (grade, value) => {
    setTargetDist((prev) => ({ ...prev, [grade]: Number(value) }));
    setPreset('사용자정의');
  };

  const handlePresetChange = (val) => {
    setPreset(val);
    if (val === '프리셋: 일반고') {
      setTargetDist({ A: 45, B: 25, C: 15, D: 10, E: 5 });
    } else if (val === '과고·특목고') {
      setTargetDist({ A: 60, B: 20, C: 10, D: 7, E: 3 });
    }
  };

  const handleItemUpdate = (index, updated) => {
    setItems((prev) => prev.map((item, i) => (i === index ? updated : item)));
  };

  const handleItemDelete = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, id: i + 1 })));
  };

  const handleItemDuplicate = (index) => {
    setItems((prev) => {
      const newItem = { ...prev[index] };
      const next = [...prev];
      next.splice(index + 1, 0, newItem);
      return next.map((item, i) => ({ ...item, id: i + 1 }));
    });
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: prev.length + 1, type: '선택형', difficulty: '보통', score: 4, correctRate: 70 },
    ]);
  };

  const handleAddMultiple = () => {
    setItems((prev) => {
      const additions = Array.from({ length: 3 }, (_, i) => ({
        id: prev.length + i + 1,
        type: '선택형',
        difficulty: '보통',
        score: 4,
        correctRate: 70,
      }));
      return [...prev, ...additions];
    });
  };

  const handleSort = () => {
    const order = { 쉬움: 0, 보통: 1, 어려움: 2 };
    setItems((prev) =>
      [...prev].sort((a, b) => order[a.difficulty] - order[b.difficulty]).map((item, i) => ({ ...item, id: i + 1 }))
    );
  };

  const computeCutScores = () => {
    const weightedCorrect = items.reduce((sum, item) => sum + item.score * (item.correctRate / 100), 0);
    const avgRate = totalScore > 0 ? weightedCorrect / totalScore : 0;
    const AB = (avgRate * totalScore * 1.15).toFixed(1);
    const BC = (avgRate * totalScore * 0.9).toFixed(1);
    const CD = (avgRate * totalScore * 0.6).toFixed(1);
    const DE = (avgRate * totalScore * 0.35).toFixed(1);
    return { AB, BC, CD, DE };
  };

  const cutScores = computeCutScores();

  const groupedItems = () => {
    const groups = {};
    items.forEach((item) => {
      const key = `${item.type}-${item.difficulty}`;
      if (!groups[key]) {
        groups[key] = { type: item.type, difficulty: item.difficulty, ids: [], totalScore: 0, correctRate: item.correctRate };
      }
      groups[key].ids.push(item.id);
      groups[key].totalScore += item.score;
    });
    return Object.values(groups);
  };

  const expectedDist = () => {
    const avgRate = totalScore > 0 ? items.reduce((sum, item) => sum + item.score * (item.correctRate / 100), 0) / totalScore : 0;
    const A = (avgRate * 100 * 1.02).toFixed(1);
    const B = ((100 - parseFloat(A)) * 0.5).toFixed(1);
    const C = ((100 - parseFloat(A) - parseFloat(B)) * 0.5).toFixed(1);
    const D = ((100 - parseFloat(A) - parseFloat(B) - parseFloat(C)) * 0.5).toFixed(1);
    const E = (100 - parseFloat(A) - parseFloat(B) - parseFloat(C) - parseFloat(D)).toFixed(1);
    return { A, B, C, D, E };
  };

  const exp = expectedDist();

  const alertSumError = targetSum !== 100;
  const alertAHigh = targetDist.A > 40;
  const alertDELow = parseFloat(cutScores.DE) < 40;

  const handleCopy = () => {
    const text = [
      cutScores.AB, cutScores.BC, cutScores.CD, cutScores.DE,
      targetDist.A, targetDist.B, targetDist.C, targetDist.D, targetDist.E,
      exp.A, exp.B, exp.C, exp.D, exp.E, totalScore
    ].join('\t');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={customStyles.root}>
      <header style={customStyles.appHeader}>
        <div style={customStyles.appHeaderLeft}>
          <h1 style={customStyles.appHeaderH1}>NEIS 분할점수 계산기</h1>
          <span style={{ ...customStyles.textSmall, ...customStyles.textMuted }}>Made by DoRm</span>
        </div>
        <nav style={customStyles.appHeaderNav}>
          <button style={customStyles.navLink}>도움말</button>
          <button style={customStyles.navLink}>설정</button>
        </nav>
      </header>

      <main style={customStyles.appMain}>
        {/* Left Pane */}
        <div style={customStyles.paneLeft}>
          {/* Section: 시험 정보 */}
          <section style={customStyles.section}>
            <div style={customStyles.sectionHeader}>
              <h2 style={customStyles.sectionTitle}>시험 정보</h2>
              <span style={{ ...customStyles.textSmall, ...customStyles.textMuted }}>저장·불러오기 구분용이라 비워둬도 괜찮아요</span>
            </div>
            <div style={customStyles.grid2x2}>
              <div>
                <label style={customStyles.label}>학교명</label>
                <input
                  type="text"
                  style={customStyles.input}
                  value={examInfo.school}
                  onChange={(e) => setExamInfo((p) => ({ ...p, school: e.target.value }))}
                />
              </div>
              <div>
                <label style={customStyles.label}>과목명</label>
                <input
                  type="text"
                  style={customStyles.input}
                  value={examInfo.subject}
                  onChange={(e) => setExamInfo((p) => ({ ...p, subject: e.target.value }))}
                />
              </div>
              <div>
                <label style={customStyles.label}>학년·학기</label>
                <input
                  type="text"
                  style={customStyles.input}
                  value={examInfo.gradeterm}
                  onChange={(e) => setExamInfo((p) => ({ ...p, gradeterm: e.target.value }))}
                />
              </div>
              <div>
                <label style={customStyles.label}>시험명</label>
                <input
                  type="text"
                  style={customStyles.input}
                  value={examInfo.examname}
                  onChange={(e) => setExamInfo((p) => ({ ...p, examname: e.target.value }))}
                />
              </div>
            </div>
          </section>

          {/* Section: 목표 성취도 분포 */}
          <section style={customStyles.section}>
            <div style={customStyles.sectionHeader}>
              <h2 style={customStyles.sectionTitle}>목표 성취도 분포</h2>
              <div style={customStyles.sectionActions}>
                <select
                  style={customStyles.selectSmall}
                  value={preset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                >
                  <option>프리셋: 일반고</option>
                  <option>과고·특목고</option>
                  <option>사용자정의</option>
                </select>
              </div>
            </div>
            <div style={customStyles.targetDistRow}>
              {['A', 'B', 'C', 'D', 'E'].map((grade) => (
                <div key={grade} style={customStyles.targetDistField}>
                  <label style={customStyles.label}>{grade} (%)</label>
                  <input
                    type="number"
                    style={{ ...customStyles.input, textAlign: 'right' }}
                    value={targetDist[grade]}
                    onChange={(e) => handleDistChange(grade, e.target.value)}
                  />
                </div>
              ))}
              <div style={customStyles.targetSum}>합계: {targetSum}%</div>
            </div>
            {alertAHigh && (
              <div style={customStyles.inlineWarning}>
                A 비율이 40%를 초과합니다. 교육부 권고를 초과하는 값입니다.
              </div>
            )}
          </section>

          {/* Section: 문항 목록 */}
          <section style={customStyles.sectionLast}>
            <div style={customStyles.sectionHeader}>
              <h2 style={customStyles.sectionTitle}>문항 목록</h2>
              <div style={customStyles.sectionActions}>
                <span style={{ ...customStyles.textSmall, ...customStyles.textMuted, marginRight: '12px', alignSelf: 'center' }}>
                  총 배점: {totalScore}점
                </span>
                <button style={customStyles.button} onClick={handleAddMultiple}>여러 개 추가</button>
                <button style={customStyles.button} onClick={handleSort}>정렬</button>
                <button style={customStyles.button} onClick={handleAddItem}>문항 추가</button>
              </div>
            </div>

            <div>
              <div style={customStyles.itemListHeader}>
                <div>번호</div>
                <div>문항구분</div>
                <div>난이도</div>
                <div>배점</div>
                <div>예상 정답률</div>
                <div></div>
              </div>
              {items.map((item, index) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  onUpdate={handleItemUpdate}
                  onDelete={handleItemDelete}
                  onDuplicate={handleItemDuplicate}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Right Pane */}
        <div style={customStyles.paneRight}>
          {/* Section: 예상 분할점수 */}
          <section style={customStyles.section}>
            <div style={customStyles.sectionHeader}>
              <h2 style={customStyles.sectionTitle}>예상 분할점수</h2>
            </div>
            <div style={customStyles.cutScoresGrid}>
              {[
                { label: 'A/B', value: `${cutScores.AB}점` },
                { label: 'B/C', value: `${cutScores.BC}점` },
                { label: 'C/D', value: `${cutScores.CD}점` },
                { label: 'D/E', value: `${cutScores.DE}점` },
              ].map((s) => (
                <div key={s.label} style={customStyles.scoreCard}>
                  <span style={customStyles.scoreLabel}>{s.label}</span>
                  <span style={customStyles.scoreValue}>{s.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: NEIS 입력 표 */}
          <section style={customStyles.section}>
            <div style={customStyles.sectionHeader}>
              <h2 style={customStyles.sectionTitle}>NEIS 입력 표</h2>
              <div style={customStyles.sectionActions}>
                <select style={customStyles.selectSmall} value={neisMode} onChange={(e) => setNeisMode(e.target.value)}>
                  <option>5수준(A-E) + 미도달</option>
                  <option>5수준(A-E)</option>
                </select>
                <select style={customStyles.selectSmall} value={neisUnit} onChange={(e) => setNeisUnit(e.target.value)}>
                  <option>5% 단위</option>
                </select>
              </div>
            </div>
            <table style={customStyles.table}>
              <thead>
                <tr>
                  <th rowSpan={2} style={customStyles.th}>문항구분</th>
                  <th rowSpan={2} style={customStyles.th}>난이도</th>
                  <th rowSpan={2} style={customStyles.th}>해당문항번호</th>
                  <th rowSpan={2} style={customStyles.th}>문항수</th>
                  <th rowSpan={2} style={customStyles.th}>배점합</th>
                  <th colSpan={5} style={customStyles.th}>예상정답률</th>
                </tr>
                <tr>
                  {['A', 'B', 'C', 'D', 'E'].map((g) => (
                    <th key={g} style={customStyles.th}>{g}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedItems().map((g, i) => {
                  const baseRate = g.correctRate;
                  const rates = {
                    A: Math.min(100, baseRate + 0),
                    B: Math.max(0, baseRate - 15),
                    C: Math.max(0, baseRate - 30),
                    D: Math.max(0, baseRate - 50),
                    E: Math.max(0, baseRate - 70),
                  };
                  return (
                    <tr key={i}>
                      <td style={customStyles.tdCenter}>{g.type}</td>
                      <td style={customStyles.tdCenter}>{g.difficulty}</td>
                      <td style={customStyles.tdLeft}>{g.ids.join(',')}</td>
                      <td style={customStyles.td}>{g.ids.length}</td>
                      <td style={customStyles.td}>{g.totalScore}</td>
                      <td style={customStyles.td}>{rates.A}</td>
                      <td style={customStyles.td}>{rates.B}</td>
                      <td style={customStyles.td}>{rates.C}</td>
                      <td style={customStyles.td}>{rates.D}</td>
                      <td style={customStyles.td}>{rates.E}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {/* Section: 예상 분포 vs 목표 */}
          <section style={customStyles.section}>
            <div style={customStyles.sectionHeader}>
              <h2 style={customStyles.sectionTitle}>예상 분포 vs 목표</h2>
            </div>
            <table style={customStyles.table}>
              <thead>
                <tr>
                  <th style={customStyles.th}>등급</th>
                  <th style={customStyles.th}>목표</th>
                  <th style={customStyles.th}>예상</th>
                  <th style={customStyles.th}>차이</th>
                </tr>
              </thead>
              <tbody>
                {['A', 'B', 'C', 'D', 'E'].map((grade) => {
                  const target = Number(targetDist[grade]);
                  const expected = Number(exp[grade]);
                  const diff = (expected - target).toFixed(1);
                  const diffStr = diff > 0 ? `+${diff}%` : `${diff}%`;
                  return (
                    <tr key={grade}>
                      <td style={customStyles.tdCenter}>{grade}</td>
                      <td style={customStyles.td}>{target.toFixed(1)}%</td>
                      <td style={customStyles.td}>{expected}%</td>
                      <td style={customStyles.td}>{diffStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {/* Section: 경고 / 안내 */}
          <section style={customStyles.sectionLast}>
            <div style={customStyles.sectionHeader}>
              <h2 style={customStyles.sectionTitle}>경고 / 안내</h2>
            </div>
            <div style={customStyles.alertList}>
              {alertSumError && (
                <div style={customStyles.alertError}>
                  <span style={{ marginRight: '8px', opacity: 0.5 }}>—</span>
                  성취도 비율의 합이 100%가 되어야 합니다. 현재: {targetSum}%
                </div>
              )}
              {alertAHigh && (
                <div style={customStyles.alertWarning}>
                  <span style={{ marginRight: '8px', opacity: 0.5 }}>—</span>
                  A 비율이 40%를 초과합니다. 교육부 권고를 초과하는 값입니다.
                </div>
              )}
              {alertDELow && (
                <div style={customStyles.alertInfo}>
                  <span style={{ marginRight: '8px', opacity: 0.5 }}>—</span>
                  D/E 분할점수가 {cutScores.DE}점으로 40점 미만입니다.
                </div>
              )}
              {!alertSumError && !alertAHigh && !alertDELow && (
                <div style={customStyles.alertInfo}>
                  <span style={{ marginRight: '8px', opacity: 0.5 }}>—</span>
                  경고 사항이 없습니다.
                </div>
              )}
            </div>

            <div style={{ marginTop: '32px' }}>
              <button style={customStyles.btnPrimary} onClick={handleCopy}>
                {copied ? '복사됨!' : 'NEIS에 복사하기'}
              </button>
              <p style={{ ...customStyles.textSmall, ...customStyles.textMuted, textAlign: 'center', marginTop: '8px' }}>
                클릭하면 15개 값이 클립보드에 복사됩니다
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;