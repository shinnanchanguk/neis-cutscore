# NEIS 분할점수 계산기 — 전체 구현 계획서

> **Made by DoRm**
> 교사가 문항별 배점·난이도·예상 정답률을 입력하면, NEIS "추정분할점수 산출관리" 화면에 그대로 복붙할 수 있는 15칸 표를 자동 생성하는 Tauri 데스크톱 앱.

---

## 0. 이 문서의 목적

이 문서는 **Claude Code에 그대로 복붙**하여 한 번에 구현할 수 있도록 작성된 완전 명세서입니다.
- 개념 → 수학 모델 → UX → 기술 스택 → 구현 단계 순서로 배치
- 모든 계산식, 프리셋 값, UI 레이아웃, 파일 구조가 포함되어 있어 추가 질문 없이 구현 가능해야 함
- 빠진 내용이 있으면 개발자(Claude Code)가 합리적 기본값으로 자체 결정

---

## 1. 프로젝트 개요

### 1.1 앱 정보
- **앱 이름**: NEIS 분할점수 계산기
- **제작**: Made by DoRm (이 문구는 앱 About/하단에 반드시 표시)
- **대상 사용자**: 한국 중·고등학교 교사 (특히 성취평가제 지필평가/정기시험 담당)
- **플랫폼**: Windows (주 타겟), macOS, Linux
- **설치 형태**: Tauri 기반 네이티브 데스크톱 앱 (.msi / .dmg / .AppImage)
- **동작 방식**: 완전 오프라인, 외부 통신 없음 (시험 문항 정보는 보안 민감 데이터)

### 1.2 핵심 가치 제안
NEIS의 "추정분할점수 산출관리" 화면은 교사에게 3×5(혹은 3×6) 매트릭스의 최소능력자 예상정답률을 요구한다.
이 값을 직접 감으로 찍으면:
- 결과 분할점수가 널뛰어 A가 0명 혹은 80%가 나옴
- 교사 간 차이가 20% 이상 나서 라운드 반복
- 학부모 민원 대응 어려움

이 앱은 교사가 **직관적으로 이해 가능한 입력(문항별 전체 평균 정답률)**만 넣으면,
1PL Rasch 문항반응모델 기반으로 NEIS 15칸을 자동 계산해준다.

---

## 2. 배경 지식 (앱 도움말에도 그대로 포함)

### 2.1 추정분할점수란
성취평가제(절대평가)의 원칙은 "성취기준 이해도 90% 이상이면 A"다. 그러나 **"성취기준 이해도 90%"와 "원점수 90점"은 다르다.** 시험이 어려우면 90% 이해한 학생도 80점밖에 못 받을 수 있다.

**추정분할점수**란: 교과 특성과 문항 난이도를 고려해 "이번 시험에서 90% 수준 도달 학생은 몇 점쯤 받을까?"를 사전에 추정하여 분할점수(A/B, B/C, C/D, D/E)를 산출하는 방식이다.

예: 교사가 NEIS 분할점수 산출기능에 예상정답률을 입력하면, 분할점수가 A/B 87점, B/C 73점, C/D 65점, D/E 56점 등으로 자동 산출된다.

### 2.2 고정분할점수 vs 추정분할점수
- **고정분할점수**: 90/80/70/60점을 그대로 적용. 간편하지만 시험 난이도 반영 불가.
- **추정분할점수**: 문항 난이도·학생 특성을 반영해 산출. 이론적 타당성 높으나 설명 부담 있음.

2025학년도 고등학교 학업성적관리 시행지침은 "기준 성취율에 따른 분할점수를 과목별로 학교가 설정할 수 있으며, 추정분할점수 설정 시 교육정보시스템(NEIS)의 해당 기능을 사용"하도록 규정한다.

### 2.3 Modified Angoff/Ebel 방법 (NEIS 내부 로직)
한국 성취평가제의 분할점수 산출은 **Ebel 방법의 변형**이다:
1. 문항을 **범주(category)** 로 묶음 (보통 난이도 × 영역). NEIS에서는 기본적으로 쉬움/보통/어려움 3범주.
2. 각 범주에 대해 4~5개 경계(A/B, B/C, C/D, D/E, [미도달]) 학생의 **예상정답률**을 입력.
3. 경계 학생 = **최소능력자(borderline examinee)** = "간신히 해당 등급에 턱걸이한 학생". 최상위 A 학생이 아님.
4. NEIS가 자동 계산: `분할점수_X = Σ(범주 배점합 × 경계X 정답률 / 100)`
5. 5% 단위로만 입력 가능.
6. 지필평가는 최소 2라운드 진행 (교사 간 차이 20% 이상인 범주 재논의).

### 2.4 2026학년도 경기도 용어 변경
2026 경기도 학업성적관리 시행지침부터 **"지필평가" → "정기시험"** 으로 명칭 변경. 수행평가 비율 30%, 논술형평가 비율 30% 조정.
본 앱 UI에서는 두 용어를 병기하거나 설정에서 선택 가능하게 한다 (기본: "정기시험").

### 2.5 공식 분포 규정 (유일한 제약)
**"A나 E가 40%를 넘지 말라"** 는 권고 외에는 공식적으로 정해진 이상적 분포가 없다. 성취평가제는 절대평가이므로 이론상 전원 A도 가능하다. 일반적으로 관찰되는 경향은 "A와 E가 가장 적고 C로 갈수록 많은" 종모양이지만, 이는 서술적 관찰일 뿐 규범이 아니다.

---

## 3. 핵심 수학 모델 (1PL Rasch + 표준정규)

### 3.1 모델 선택 이유
- **2PL, 3PL IRT 모델**: 변별력·추측 파라미터 추가 필요 → 단일 시험으로는 추정 불가능
- **σ 가정 기반**: 원점수 분포의 표준편차를 추가 가정해야 함
- **1PL Rasch on standardized θ**: 목표 분포가 곧 학생 능력 분포이므로 σ 불필요. **추가 파라미터 0개**, 입력만으로 유일해가 결정됨.

### 3.2 핵심 아이디어
교사가 입력하는 "문항 평균 정답률"은 **평균 능력(z=0) 학생의 정답 확률**로 해석한다.
목표 분포(A 35% / B 35% / C 20% / D 8% / E 2% 등)는 **학생 집단의 능력 순위 분포**로 해석한다.
→ σ 없이 표준화된 z 공간에서 모든 계산이 닫힌 형태로 떨어진다.

### 3.3 계산 공식

#### 3.3.1 목표 분포 → 경계 z값
목표 분포가 `{A%, B%, C%, D%, E%}` 일 때, 각 경계는 상위 누적 비율의 역정규분포값:

```
z_AB = Φ⁻¹(1 - A/100)
z_BC = Φ⁻¹(1 - (A+B)/100)
z_CD = Φ⁻¹(1 - (A+B+C)/100)
z_DE = Φ⁻¹(1 - (A+B+C+D)/100)
z_E미도달 = Φ⁻¹(1 - (A+B+C+D+E)/100)   // 5수준(A-E)+미도달 모드에서만
```

예: {35, 35, 20, 8, 2} →
- z_AB = Φ⁻¹(0.65) ≈ 0.385
- z_BC = Φ⁻¹(0.30) ≈ -0.524
- z_CD = Φ⁻¹(0.10) ≈ -1.282
- z_DE = Φ⁻¹(0.02) ≈ -2.054
- z_E미도달 = Φ⁻¹(0.00) → 실무상 -3.0 하한 클램프

#### 3.3.2 문항 난이도 역산
문항 `i` 의 교사 입력 평균 정답률 `p_i` (0~1 스케일) →
1PL Rasch에서 평균 학생(θ=0)의 정답 확률이 `p_i` 이면:
```
Φ(-b_i) = p_i
b_i = -Φ⁻¹(p_i)
```

#### 3.3.3 경계 학생별 문항 정답 확률
경계 `k` 의 z값 `z_k` 에서 문항 `i` 의 정답 확률:
```
p(i,k) = Φ(z_k - b_i) = Φ(z_k + Φ⁻¹(p_i))
```

#### 3.3.4 범주별 가중 평균 (NEIS 칸 값)
범주 `c` (쉬움/보통/어려움 중 하나)에 속한 문항 집합 `I_c` 의 배점 가중 평균:
```
P(c, k) = Σ_{i∈I_c} (배점_i × p(i,k)) / Σ_{i∈I_c} 배점_i
```
→ 이것이 NEIS의 (범주 c × 등급 k) 칸에 들어갈 최종 값.

#### 3.3.5 5% 단위 반올림
```
NEIS_value(c, k) = round(P(c,k) × 100 / 5) × 5
```
- 0~100 범위 클램프
- 반올림 후 단조성 제약(§3.4) 검증 및 필요시 보정

#### 3.3.6 예상 분할점수 (역검증용)
```
분할점수_k = Σ_c (배점합_c × NEIS_value(c,k) / 100)
```
이 값이 실제 NEIS가 내부적으로 계산해 보여줄 값과 같아야 한다.

#### 3.3.7 예상 성취도 분포 (사후 검증용)
산출된 분할점수 4개를 가지고, 학생 점수를 시뮬레이션한 뒤 실제 분포를 역산해본다.
이때만 σ 가정이 필요하며, 이는 "사후 검증 보조 지표"로만 사용한다 (주 계산 경로에는 영향 없음).
- σ 기본값: 15 (사용자 조정 가능, 설정에서)
- 학생 평균 점수: 문항별 평균 정답률 × 배점의 합
- 정규분포 가정하에 각 분할점수 이상 비율 계산 → 예상 분포 표시

### 3.4 단조성 제약

#### 3.4.1 행 단조성 (Row monotonicity)
같은 범주 내에서: `NEIS(c, A) ≥ NEIS(c, B) ≥ NEIS(c, C) ≥ NEIS(c, D) ≥ NEIS(c, E)`
이유: 상위 등급 경계 학생일수록 모든 문항에서 정답률이 같거나 높아야 함.

#### 3.4.2 열 단조성 (Column monotonicity)
같은 등급 열에서: `NEIS(쉬움, k) ≥ NEIS(보통, k) ≥ NEIS(어려움, k)`
이유: 같은 능력 학생이라면 쉬운 문제일수록 맞힐 확률이 높음.

#### 3.4.3 5% 반올림 후 위반 처리
1PL 모델에서 나온 연속값은 자동으로 단조성을 만족하지만, 5% 반올림 과정에서 tie나 역전이 발생할 수 있다. 이때:
- 위반 발견 시 위쪽 값을 아래쪽 값 이상으로 끌어올리거나, 아래쪽 값을 위쪽 값 이하로 끌어내림
- 목표 분포와의 오차를 최소화하는 방향으로 보정 (경량 정수 최적화; 15칸이라 brute force 허용)

### 3.5 경계값 처리
- `p_i = 0` 또는 `p_i = 1` 이면 `Φ⁻¹` 발산 → `p_i ∈ [0.01, 0.99]` 로 클램프
- `z` 값이 ±∞가 나오는 경우 (예: A=0% 또는 A=100%) → `[-3.0, 3.0]` 로 클램프
- 결과 정답률은 `[0, 100]` 범위로 클램프

---

## 4. 프리셋 (기본값)

### 4.1 목표 분포 프리셋
```typescript
const PRESETS = {
  일반고: { A: 15, B: 30, C: 30, D: 18, E: 7 },   // 합 100
  과고_특목고: { A: 35, B: 35, C: 20, D: 8, E: 2 }, // 합 100
  사용자정의: { A: 20, B: 30, C: 30, D: 15, E: 5 }  // 초기값, 수정 가능
}
```

### 4.2 기본 선택
- 첫 실행 시 **일반고** 프리셋 선택됨
- 사용자가 변경하면 로컬 저장소에 기억, 다음 실행 시 마지막 선택 복원

### 4.3 경고 규칙
| 조건 | 경고 레벨 | 메시지 |
|---|---|---|
| A > 40% | warning | "A 비율이 40%를 초과합니다. 교육부 권고를 초과하는 값입니다." |
| E > 40% | warning | "E 비율이 40%를 초과합니다. 교육부 권고를 초과하는 값입니다." |
| 합계 ≠ 100 | error | "성취도 비율의 합이 100%가 되어야 합니다. 현재: XX%" |
| 음수 또는 소수점 | error | "0 이상의 정수만 입력 가능합니다" |

---

## 5. 입력/출력 스펙

### 5.1 교사 입력 (앱 UI)

#### 5.1.1 시험 메타 정보
| 필드 | 타입 | 기본값 | 필수 | 설명 |
|---|---|---|---|---|
| 학교명 | string | "" | ❌ | 저장/불러오기 구분용 |
| 과목명 | string | "" | ❌ | 저장/불러오기 구분용 |
| 학년/학기 | string | "" | ❌ | 저장/불러오기 구분용 |
| 시험명 | string | "2026-1 중간고사" | ❌ | 저장/불러오기 구분용 |
| 총 배점 | number | 100 | ✅ | 자동 계산 (문항 배점합) |

#### 5.1.2 평가단계 (고정)
- 5수준(A-E) + 미도달: **기본 선택, 고정**
- (향후 5수준만 모드 추가 가능하나 MVP에서는 미도달 포함 고정)

#### 5.1.3 예상정답률 단위 (고정)
- 5% 단위 (NEIS 강제 규정)

#### 5.1.4 문항 목록 (동적 행 추가/삭제)
각 행:
| 필드 | 타입 | 제약 |
|---|---|---|
| 문항번호 | number | 1 이상 정수, 자동 증가 |
| 문항구분 | enum | 선택형 / 서답형 (기본: 서답형) |
| 난이도 | enum | 쉬움 / 보통 / 어려움 (기본: 보통) |
| 배점 | number | 0.5 단위 허용, 양수 |
| 예상 정답률 | slider | 0~100%, 1% 단위로 조작, 기본 60% |

추가 기능:
- 문항 일괄 추가 (N개 한꺼번에 생성)
- 문항 복제
- CSV 가져오기/내보내기 (향후 확장)
- 드래그 정렬

#### 5.1.5 목표 분포 입력
- 프리셋 선택 드롭다운 (일반고 / 과고_특목고 / 사용자정의)
- 5개 숫자 입력란 (A, B, C, D, E), 합계 실시간 표시
- 합이 100이 아니면 에러 표시

### 5.2 앱 출력

#### 5.2.1 NEIS 입력 표 (핵심 출력물)
선생님이 공유한 캡처와 동일한 레이아웃:

```
예상정답률을 입력 Total 3
평가단계: ● 5수준(A-E) + 미도달   ○ 5수준(A-E)
예상정답률 구분: ● 5% 단위

┌─────────┬────────┬──────┬────────────┬──────┬──────┬──────────────────────────────┐
│         │문항구분│난이도│해당문항번호│문항수│배점합│    최소능력자 예상정답률(%)  │
│         │        │      │            │      │      │  A    B    C    D    E       │
├─────────┼────────┼──────┼────────────┼──────┼──────┼──────────────────────────────┤
│  ☐     │서답형  │쉬움  │1, 3, 11, 12│  4   │ 21   │ 95   80   60   40   25       │
│  ☐     │서답형  │보통  │2,4,5,6,7,9 │  6   │ 43   │ 80   65   45   25   15       │
│  ☐     │서답형  │어려움│8,10,13,14  │  4   │ 36   │ 45   30   15    5    0       │
└─────────┴────────┴──────┴────────────┴──────┴──────┴──────────────────────────────┘
```

- 폰트·색상·테이블 테두리는 NEIS 원본과 유사하게 (교사가 바로 알아볼 수 있게)
- 각 셀의 숫자는 클릭 가능, 클릭 시 "계산 근거" 팝오버로 z값과 중간 계산 표시

#### 5.2.2 예상 분할점수
```
┌──────────────────────────────────┐
│  예상 분할점수 (내부 계산 결과)  │
├──────────────────────────────────┤
│  A/B 분할점수:   70.6 점          │
│  B/C 분할점수:   55.6 점          │
│  C/D 분할점수:   37.4 점          │
│  D/E 분할점수:   20.9 점          │
└──────────────────────────────────┘
```

#### 5.2.3 예상 성취도 분포 vs 목표 비교
```
          목표    예상     차이
  A       35%    32%      ▼3%
  B       35%    36%      ▲1%
  C       20%    21%      ▲1%
  D        8%     8%       0%
  E        2%     3%      ▲1%
```
- 차이 ≥ 5%인 등급은 색상 강조

#### 5.2.4 경고/알림 영역
- 단조성 위반 (있으면)
- 분포 경고 (A/E > 40%)
- 미도달 경계 주의 (D/E 분할점수가 40점 미만일 경우)
- 정답률 전체가 너무 낮거나 높음 (모든 문항 < 20% or > 95%)

#### 5.2.5 NEIS 복사 기능
- **"NEIS에 복사하기"** 버튼
- 클릭 시 15개 값을 클립보드에 탭 구분 형식으로 복사 (NEIS 엑셀 업로드 양식과 호환되게)
- 또는 각 칸 값을 NEIS 화면 순서대로 탭/엔터 구분 텍스트로 복사
- 복사 후 "복사 완료" 토스트

### 5.3 저장/불러오기
- **자동 저장**: 모든 입력은 입력 즉시 로컬 저장 (작업 중 닫혀도 복원)
- **시험 프로젝트 저장**: "다른 이름으로 저장" 기능, 파일 확장자 `.neiscut` (JSON)
- **최근 파일 목록**: 최근 10개 시험 프로젝트
- **내보내기**: 결과를 PDF, PNG, CSV로 내보내기 (향후 확장, MVP 제외 가능)

---

## 6. UI/UX 스펙

### 6.1 화면 구성 (단일 페이지 스크롤)
```
┌────────────────────────────────────────────┐
│  [헤더] NEIS 분할점수 계산기          [?]  │
│          Made by DoRm                      │
├────────────────────────────────────────────┤
│  [시험 정보 섹션]                          │
│  학교: [___] 과목: [___] 시험명: [___]    │
├────────────────────────────────────────────┤
│  [목표 분포 섹션]                          │
│  프리셋: [일반고 ▼]                        │
│  A:[15] B:[30] C:[30] D:[18] E:[7]  합100 │
├────────────────────────────────────────────┤
│  [문항 입력 섹션]                          │
│  ┌────────────────────────────────────┐   │
│  │ #│구분│난이도│배점│정답률       │✕│   │
│  │ 1│서답│쉬움  │5  │[■■■■□]85%   │ │   │
│  │ 2│서답│보통  │7  │[■■■□□]60%   │ │   │
│  │...                                │   │
│  └────────────────────────────────────┘   │
│  [+ 문항 추가]  [일괄 추가]  [정렬]       │
├────────────────────────────────────────────┤
│  [결과 섹션 — 실시간 갱신]                 │
│  ┌─ NEIS 입력 표 ──────────────────────┐  │
│  │ (§5.2.1 표)                        │  │
│  └────────────────────────────────────┘  │
│  [📋 NEIS에 복사하기]                      │
│                                            │
│  ┌─ 예상 분할점수 ──┐ ┌─ 분포 비교 ──┐  │
│  │ A/B 70.6         │ │ 목표 vs 예상 │  │
│  │ B/C 55.6         │ │              │  │
│  │ ...              │ │              │  │
│  └──────────────────┘ └──────────────┘  │
│                                            │
│  ⚠️ 경고 영역 (있을 때만)                  │
├────────────────────────────────────────────┤
│  [푸터] Made by DoRm · v0.1.0             │
└────────────────────────────────────────────┘
```

### 6.2 인터랙션 원칙
- **실시간 갱신**: 입력이 바뀔 때마다 결과 섹션이 즉시 재계산 (debounce 100ms)
- **숫자 조작**: 배점/정답률은 키보드 ↑↓, 휠, 슬라이더 드래그 모두 가능
- **안전한 기본값**: 모든 필드에 합리적 기본값 제공, 빈 상태 없음
- **되돌리기**: Ctrl+Z / Ctrl+Y 지원 (undo/redo 스택)

### 6.3 반응형
- 최소 창 크기: 1024 × 700
- 창 크기 변경 시 테이블 스크롤, 결과 섹션 레이아웃 자동 조정
- 최대 크기 제한 없음 (2K/4K 모니터 대응)

### 6.4 테마
- 라이트 모드 기본
- 다크 모드 지원 (시스템 설정 따라가기)
- NEIS 스크린샷을 흉내낸 "NEIS 스타일" 미리보기 테이블은 항상 베이지 배경으로 고정 (교사가 즉각 식별 가능하도록)

### 6.5 온보딩 (첫 실행 시)
3단계 모달:
1. **"추정분할점수가 뭔가요?"** — §2.1, 2.2 요약 + 그림 1장
2. **"왜 이 앱이 필요한가요?"** — NEIS 15칸 수동 입력의 고충 + 이 앱의 자동 계산 흐름도
3. **"어떻게 계산되나요?"** — 1PL Rasch 한 줄 설명 + "가정 없음, 입력만 있으면 결정" 강조

"다시 보지 않기" 체크박스, Help 메뉴에서 재실행 가능.

### 6.6 도움말 메뉴
- **개념 설명**: §2 전체 (추정분할점수, 성취평가제, Angoff/Ebel, 2026 용어 변경)
- **계산 원리**: §3 전체 (1PL Rasch, 공식, 경계 처리)
- **FAQ**:
  - Q: A가 너무 많이 나와요. 어떻게 조정하나요?
    A: 목표 분포의 A를 낮추거나, 어려움 문항의 정답률을 더 낮게 조정해보세요.
  - Q: NEIS에 어떻게 복붙하나요?
    A: "NEIS에 복사하기" 버튼 → NEIS "추정분할점수산출관리" 화면 첫 칸 클릭 → Ctrl+V.
  - Q: D/E 분할점수가 40점 미만으로 나와요.
    A: 최소 성취수준(40% 성취율) 미달 학생이 생길 수 있다는 뜻입니다. 보장지도 계획을 미리 세워두세요.
  - Q: 교과협의회에서 다른 선생님이 다른 값을 주장해요.
    A: NEIS는 최소 2라운드 진행을 요구합니다. 차이 20% 이상인 범주 위주로 논의 후 2라운드를 돌리세요.
- **변경 이력**: 버전별 변경 사항
- **About / Made by DoRm**

### 6.7 각 입력 필드 툴팁 (? 아이콘)
- **예상 정답률**: "이 문항을 학급 전체 평균 기준 몇 %가 맞힐지 예상해서 입력하세요. 상위권만 생각하지 말고 반 전체 평균입니다."
- **난이도**: "문항의 상대적 난이도입니다. NEIS는 보통 쉬움/보통/어려움 3분류를 사용합니다."
- **목표 분포**: "우리 학교/학급 학생들이 평균적으로 받는 성취도 분포입니다. 학교알리미에서 과거 분포를 참고하세요."
- **최소능력자**: "해당 등급에 간신히 턱걸이한 학생입니다. A 열이라면 'A를 간신히 받은 학생'이 이 문항을 맞힐 확률입니다."

### 6.8 계산 투명성 (교사가 학부모·관리자 설명용)
각 NEIS 셀 클릭 시 팝오버:
```
이 셀(쉬움 × A): 95%

계산 근거:
  목표 A 비율 35% → z_AB = 0.385
  쉬움 범주 평균 정답률 86%
  → Φ⁻¹(0.86) = 1.080 → b_쉬움 = -1.080
  → Φ(0.385 - (-1.080)) = Φ(1.465) ≈ 0.928
  → 5% 반올림: 95%
```
"계산 원리 자세히 보기" 링크 → 도움말 §3

---

## 7. 기술 스택

### 7.1 프레임워크
- **Tauri v2.x** — 네이티브 데스크톱 셸
- **Rust** — 최소한만 사용 (Tauri 커맨드, 파일 I/O)
- **TypeScript** — 모든 계산 로직 및 UI

### 7.2 프론트엔드
- **React 18+** — UI 렌더링
- **Vite** — 빌드/개발 서버
- **TypeScript** strict mode
- **Tailwind CSS** — 스타일링
- **shadcn/ui** — 컴포넌트 (Button, Input, Slider, Select, Dialog, Tooltip, Toast 등)
- **lucide-react** — 아이콘
- **zustand** — 상태 관리 (간단함, 교사 환경에서 안정적)
- **react-hook-form** — 폼 관리

### 7.3 수학/유틸
- **`jstat` 또는 자체 구현** — 정규분포 CDF/역CDF
  - 의존성 최소화 원칙: `Φ`, `Φ⁻¹` 는 자체 구현 권장 (Abramowitz-Stegun 근사)
- **`mathjs`** — 필요 시 (MVP에서는 불필요)

### 7.4 로컬 저장
- **Tauri `tauri-plugin-store`** 또는 `fs` API
- 저장 위치: OS별 app data directory
  - Windows: `%APPDATA%\neis-cutscore\`
  - macOS: `~/Library/Application Support/neis-cutscore/`
  - Linux: `~/.local/share/neis-cutscore/`
- 파일:
  - `settings.json` — 앱 전역 설정 (테마, 기본 프리셋, σ 등)
  - `projects/*.neiscut` — 개별 시험 프로젝트 (JSON)
  - `autosave.json` — 현재 작업 중 자동 저장

### 7.5 빌드/배포
- Windows: `.msi` 인스톨러 + portable `.exe` 둘 다 제공
- macOS: `.dmg` (코드 사이닝은 MVP 이후)
- Linux: `.AppImage`
- 버전 관리: semver, MVP는 `v0.1.0`

---

## 8. 프로젝트 구조

```
neis-cutscore/
├── src-tauri/                  # Rust / Tauri 백엔드
│   ├── src/
│   │   ├── main.rs             # Tauri 엔트리
│   │   ├── commands.rs         # 파일 I/O 커맨드
│   │   └── lib.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json         # Tauri 설정, 앱 이름 "NEIS 분할점수 계산기"
│   └── icons/                  # 앱 아이콘
├── src/                        # React 프론트엔드
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   ├── ExamMetaSection.tsx
│   │   ├── TargetDistribution.tsx
│   │   ├── ItemList.tsx
│   │   ├── ItemRow.tsx
│   │   ├── NeisOutputTable.tsx
│   │   ├── CutScoresCard.tsx
│   │   ├── DistributionComparisonCard.tsx
│   │   ├── WarningArea.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Onboarding.tsx
│   │   └── HelpDialog.tsx
│   ├── lib/
│   │   ├── math/
│   │   │   ├── normal.ts       # Φ, Φ⁻¹ 구현
│   │   │   ├── rasch.ts        # 1PL 모델
│   │   │   ├── cutscore.ts     # 메인 계산 함수
│   │   │   ├── rounding.ts     # 5% 단위 + 단조성 보정
│   │   │   └── validate.ts     # 제약 검증
│   │   ├── presets.ts          # 목표 분포 프리셋
│   │   ├── storage.ts          # Tauri fs/store 래퍼
│   │   ├── clipboard.ts        # NEIS 복사 포맷
│   │   └── types.ts            # 전역 타입
│   ├── store/
│   │   └── examStore.ts        # zustand 스토어
│   ├── content/
│   │   ├── help.md             # 도움말 (§2, §3 내용)
│   │   ├── faq.md
│   │   └── onboarding.tsx
│   ├── styles/
│   │   └── globals.css         # Tailwind
│   └── vite-env.d.ts
├── public/
│   └── neis-style.css          # NEIS 스크린샷 스타일 복제
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── README.md
└── LICENSE
```

---

## 9. 핵심 코드 스펙

### 9.1 타입 정의 (`src/lib/types.ts`)
```typescript
export type Difficulty = '쉬움' | '보통' | '어려움';
export type ItemType = '선택형' | '서답형';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Item {
  id: string;              // uuid
  number: number;          // 문항 번호
  type: ItemType;          // 선택형/서답형
  difficulty: Difficulty;  // 쉬움/보통/어려움
  points: number;          // 배점
  expectedRate: number;    // 전체 평균 예상 정답률 (0~100)
}

export interface TargetDistribution {
  A: number; B: number; C: number; D: number; E: number; // 합 100
}

export interface ExamMeta {
  school: string;
  subject: string;
  gradeLevel: string;
  examName: string;
}

export interface NeisCell {
  difficulty: Difficulty;
  grade: Grade | 'E_미도달';
  value: number;  // 0~100, 5의 배수
}

export interface NeisOutput {
  cells: NeisCell[];              // 3 × (5 or 6) 칸
  cutScores: {
    AB: number; BC: number; CD: number; DE: number;
    E_미도달?: number;
  };
  predictedDistribution: TargetDistribution;
  warnings: Warning[];
}

export interface Warning {
  level: 'info' | 'warning' | 'error';
  code: string;
  message: string;
}

export interface ExamProject {
  meta: ExamMeta;
  targetDistribution: TargetDistribution;
  items: Item[];
  createdAt: string;
  updatedAt: string;
  version: string;
}
```

### 9.2 정규분포 (`src/lib/math/normal.ts`)
```typescript
// 표준정규 누적분포함수 Φ(z)
// Abramowitz & Stegun 7.1.26 근사식
export function Phi(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * x);
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const erf = 1 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t * Math.exp(-x*x);
  return 0.5 * (1 + sign * erf);
}

// 표준정규 역누적분포함수 Φ⁻¹(p)
// Peter Acklam's algorithm
export function PhiInv(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  // ... Acklam의 고정 계수 구현
  // 안전하게: p ∈ [1e-10, 1 - 1e-10] 으로 클램프
}
```

### 9.3 메인 계산 함수 (`src/lib/math/cutscore.ts`)
```typescript
export function computeNeisOutput(
  items: Item[],
  target: TargetDistribution,
  options: { includeE미도달: boolean } = { includeE미도달: true }
): NeisOutput {
  // 1. 목표 분포 → 경계 z값
  const zAB = PhiInv(1 - target.A/100);
  const zBC = PhiInv(1 - (target.A + target.B)/100);
  const zCD = PhiInv(1 - (target.A + target.B + target.C)/100);
  const zDE = PhiInv(1 - (target.A + target.B + target.C + target.D)/100);
  // E_미도달 경계는 성취율 40% = 임의로 고정 z = -2.33 (≈ 상위 99%)
  // 또는 목표에서 E 하한을 별도로 받을 것. MVP는 0 클램프.

  // 2. 범주별 문항 그룹화
  const categories: Difficulty[] = ['쉬움', '보통', '어려움'];
  const cells: NeisCell[] = [];

  for (const cat of categories) {
    const catItems = items.filter(i => i.difficulty === cat);
    if (catItems.length === 0) continue;

    const totalPoints = catItems.reduce((s, i) => s + i.points, 0);

    // 3. 각 등급 경계에 대해 가중 평균 정답 확률 계산
    const grades: [Grade, number][] = [
      ['A', zAB], ['B', zBC], ['C', zCD], ['D', zDE],
    ];

    for (const [grade, z] of grades) {
      let weightedSum = 0;
      for (const item of catItems) {
        const pi = clamp(item.expectedRate / 100, 0.01, 0.99);
        const bi = -PhiInv(pi);
        const pik = Phi(z - bi);
        weightedSum += item.points * pik;
      }
      const avgProb = weightedSum / totalPoints;
      const raw = avgProb * 100;
      const rounded = Math.round(raw / 5) * 5;
      cells.push({ difficulty: cat, grade, value: clamp(rounded, 0, 100) });
    }

    // E_미도달 셀: D열 값보다 낮게 임의 비율 (예: D×0.5) 또는 0
    if (options.includeE미도달) {
      // 간단 구현: D열의 절반으로, 5% 반올림
      const dCell = cells.find(c => c.difficulty === cat && c.grade === 'D');
      cells.push({
        difficulty: cat,
        grade: 'E_미도달',
        value: Math.round((dCell?.value || 0) * 0.5 / 5) * 5,
      });
    }
  }

  // 4. 단조성 보정
  enforceMonotonicity(cells, categories);

  // 5. 분할점수 계산
  const cutScores = computeCutScores(cells, items);

  // 6. 예상 분포 (보조)
  const predictedDistribution = estimateDistribution(items, cutScores);

  // 7. 경고 생성
  const warnings = validateOutput(cells, cutScores, target);

  return { cells, cutScores, predictedDistribution, warnings };
}
```

### 9.4 단조성 보정 (`src/lib/math/rounding.ts`)
```typescript
export function enforceMonotonicity(
  cells: NeisCell[],
  categories: Difficulty[]
): void {
  // 행 단조성: 같은 범주 내 A ≥ B ≥ C ≥ D ≥ E
  for (const cat of categories) {
    const row = cells.filter(c => c.difficulty === cat);
    const order: (Grade | 'E_미도달')[] = ['A', 'B', 'C', 'D', 'E_미도달'];
    for (let i = 1; i < order.length; i++) {
      const prev = row.find(c => c.grade === order[i-1]);
      const cur = row.find(c => c.grade === order[i]);
      if (prev && cur && cur.value > prev.value) {
        cur.value = prev.value; // 하향 조정
      }
    }
  }

  // 열 단조성: 같은 등급 내 쉬움 ≥ 보통 ≥ 어려움
  const grades: (Grade | 'E_미도달')[] = ['A', 'B', 'C', 'D', 'E_미도달'];
  for (const grade of grades) {
    const col = categories.map(cat => cells.find(c => c.difficulty === cat && c.grade === grade))
                          .filter(Boolean) as NeisCell[];
    for (let i = 1; i < col.length; i++) {
      if (col[i].value > col[i-1].value) {
        col[i].value = col[i-1].value;
      }
    }
  }
}
```

### 9.5 분할점수 계산
```typescript
export function computeCutScores(cells: NeisCell[], items: Item[]) {
  const catPoints: Record<Difficulty, number> = {
    쉬움: items.filter(i => i.difficulty === '쉬움').reduce((s,i) => s+i.points, 0),
    보통: items.filter(i => i.difficulty === '보통').reduce((s,i) => s+i.points, 0),
    어려움: items.filter(i => i.difficulty === '어려움').reduce((s,i) => s+i.points, 0),
  };
  const grades: (Grade | 'E_미도달')[] = ['A','B','C','D','E_미도달'];
  const result: Record<string, number> = {};
  for (const grade of grades) {
    let sum = 0;
    for (const cat of ['쉬움','보통','어려움'] as Difficulty[]) {
      const cell = cells.find(c => c.difficulty === cat && c.grade === grade);
      if (cell) sum += catPoints[cat] * cell.value / 100;
    }
    result[grade] = Math.round(sum * 10) / 10; // 소수 1자리
  }
  return {
    AB: result['A'],  // A열의 값이 A/B 분할점수
    BC: result['B'],
    CD: result['C'],
    DE: result['D'],
    E_미도달: result['E_미도달'],
  };
}
```

### 9.6 검증 (`src/lib/math/validate.ts`)
```typescript
export function validateOutput(
  cells: NeisCell[],
  cutScores: any,
  target: TargetDistribution
): Warning[] {
  const warnings: Warning[] = [];

  // 목표 분포 합계
  const sum = target.A + target.B + target.C + target.D + target.E;
  if (Math.abs(sum - 100) > 0.01) {
    warnings.push({ level: 'error', code: 'SUM_NOT_100',
      message: `성취도 비율의 합이 100%가 되어야 합니다. 현재: ${sum}%` });
  }
  if (target.A > 40) warnings.push({ level: 'warning', code: 'A_OVER_40',
    message: 'A 비율이 40%를 초과합니다. 교육부 권고를 초과하는 값입니다.' });
  if (target.E > 40) warnings.push({ level: 'warning', code: 'E_OVER_40',
    message: 'E 비율이 40%를 초과합니다. 교육부 권고를 초과하는 값입니다.' });

  // D/E 분할점수가 40점 미만
  if (cutScores.DE < 40) warnings.push({ level: 'info', code: 'MIN_LEVEL_WARN',
    message: `D/E 분할점수가 ${cutScores.DE}점으로 40점 미만입니다. 최소 성취수준 미달자가 생길 수 있습니다. 보장지도 계획을 준비하세요.` });

  // 단조성 (enforceMonotonicity 이후에는 위반 없어야 함, 안전장치)
  // ...

  return warnings;
}
```

### 9.7 zustand 스토어 (`src/store/examStore.ts`)
```typescript
interface ExamState {
  meta: ExamMeta;
  targetDistribution: TargetDistribution;
  items: Item[];
  // actions
  setMeta: (meta: Partial<ExamMeta>) => void;
  setTargetPreset: (presetName: keyof typeof PRESETS) => void;
  setTargetField: (field: Grade, value: number) => void;
  addItem: () => void;
  updateItem: (id: string, patch: Partial<Item>) => void;
  removeItem: (id: string) => void;
  addBulkItems: (count: number) => void;
}
// 구현...
// localStorage 또는 Tauri store에 자동 저장 (persist 미들웨어)
```

### 9.8 클립보드 복사 (`src/lib/clipboard.ts`)
```typescript
export async function copyToNeisFormat(cells: NeisCell[]) {
  // NEIS의 입력 순서: 쉬움/보통/어려움 × A/B/C/D/E(미도달)
  const categories: Difficulty[] = ['쉬움', '보통', '어려움'];
  const grades: (Grade | 'E_미도달')[] = ['A','B','C','D','E_미도달'];
  const lines: string[] = [];
  for (const cat of categories) {
    const row: string[] = [];
    for (const grade of grades) {
      const cell = cells.find(c => c.difficulty === cat && c.grade === grade);
      row.push(cell ? String(cell.value) : '');
    }
    lines.push(row.join('\t'));
  }
  const text = lines.join('\n');
  await navigator.clipboard.writeText(text);
}
```

---

## 10. 구현 단계 (개발 순서)

### Phase 1: 스캐폴딩 (Day 1)
1. Tauri v2 프로젝트 생성 (`npm create tauri-app`), 이름 `neis-cutscore`
2. React + TypeScript + Vite 템플릿 선택
3. Tailwind CSS + shadcn/ui 설치 및 초기 설정
4. 앱 아이콘, 윈도우 제목 "NEIS 분할점수 계산기" 설정
5. 헤더/푸터에 "Made by DoRm" 표시
6. git 초기화, README 작성

### Phase 2: 수학 엔진 (Day 2)
1. `lib/math/normal.ts` — Φ, Φ⁻¹ 구현 및 단위 테스트
   - 테스트: Φ(0)=0.5, Φ(1.96)≈0.975, Φ⁻¹(0.5)=0, Φ⁻¹(0.975)≈1.96
2. `lib/math/cutscore.ts` — `computeNeisOutput` 구현
3. `lib/math/rounding.ts` — 5% 반올림 및 단조성 보정
4. `lib/math/validate.ts` — 경고 규칙
5. 통합 테스트: 문서 §3.3.1 예시(과고 프리셋 + 쉬움 86%)가 정확히 재현되는지

### Phase 3: 상태 관리 (Day 3)
1. zustand 스토어 구현, persist 미들웨어로 자동 저장
2. 프리셋, 기본값 정의
3. 수학 엔진 연결 (derived state 또는 selector)

### Phase 4: 입력 UI (Day 4~5)
1. `ExamMetaSection` — 시험 메타 정보
2. `TargetDistribution` — 프리셋 드롭다운 + 5개 숫자 입력
3. `ItemList` / `ItemRow` — 문항 테이블 (추가/삭제/수정)
4. 슬라이더 + 숫자 입력 (양방향 바인딩)
5. 드래그 정렬 (`dnd-kit`)

### Phase 5: 출력 UI (Day 6)
1. `NeisOutputTable` — NEIS 캡처와 유사한 스타일 (베이지 배경, 그리드)
2. `CutScoresCard`
3. `DistributionComparisonCard`
4. `WarningArea`
5. "NEIS에 복사하기" 버튼 + 토스트

### Phase 6: 도움말/온보딩 (Day 7)
1. `Onboarding` 3단계 모달 (react-hook-form 상태)
2. `HelpDialog` — 탭 구조 (개념/계산원리/FAQ/About)
3. 각 필드 Tooltip 배치
4. 셀 클릭 시 계산 근거 팝오버

### Phase 7: 저장/불러오기 (Day 8)
1. Tauri `fs` 또는 `tauri-plugin-store` 설정
2. 자동 저장 훅
3. "다른 이름으로 저장" / "열기" 다이얼로그
4. 최근 파일 목록

### Phase 8: 빌드/배포 (Day 9)
1. 앱 아이콘 (Tauri icon 규격에 맞게)
2. `tauri.conf.json` 에서 윈도우 제목, 번들 ID 설정
3. Windows `.msi`, macOS `.dmg` 빌드
4. 첫 릴리스 `v0.1.0`

### Phase 9: 사용자 테스트 (Day 10)
1. 과고 수학 실제 시험 문항 입력 → 결과 검증
2. 일반고 프리셋 케이스
3. 극단값 (모두 쉬움, 모두 어려움, A 40% 초과 등)
4. 문항 0개, 1개 에지 케이스

---

## 11. 테스트 시나리오

### 11.1 기본 동작
- [ ] 앱 실행 시 온보딩 모달 표시
- [ ] "다시 보지 않기" 체크 시 다음 실행부터 미표시
- [ ] 기본 프리셋(일반고) 자동 선택
- [ ] 빈 문항 상태에서도 크래시 없음

### 11.2 수학 정합성
- [ ] 과고 프리셋 + 문서 §3.3.1 예시 입력 → NEIS 표가 정확히 일치
- [ ] 목표 분포 합이 100 아니면 경고
- [ ] A=40%, E=40% 경계에서 경고 없음, 40.01% 부터 경고
- [ ] 쉬움 100% 입력 시 A~E 모두 100으로 클램프
- [ ] 어려움 0% 입력 시 A~E 모두 0으로 클램프

### 11.3 단조성
- [ ] 생성된 모든 출력에서 행 단조성, 열 단조성 위반 없음
- [ ] 극단 입력(쉬움 50%, 보통 80%)에서도 단조성 유지 (강제 보정)

### 11.4 NEIS 복사
- [ ] "복사하기" 클릭 → 클립보드에 탭/엔터 구분 텍스트
- [ ] Excel에 붙여넣기 시 3행 5열 매트릭스로 정렬

### 11.5 저장/불러오기
- [ ] 입력 중 앱 강제 종료 → 재실행 시 이전 상태 복원
- [ ] `.neiscut` 파일 저장/불러오기 양방향 동작
- [ ] 최근 파일 목록 최대 10개 유지

### 11.6 UI/UX
- [ ] 1024×700 최소 창 크기에서 레이아웃 깨짐 없음
- [ ] 다크 모드 토글 정상 동작
- [ ] 모든 툴팁 동작
- [ ] 셀 클릭 시 계산 근거 팝오버 표시

---

## 12. 비기능 요구사항

### 12.1 성능
- 문항 100개까지 실시간 재계산 100ms 이내
- 앱 시작 시간 2초 이내
- 메모리 사용량 150MB 이하

### 12.2 보안
- 네트워크 요청 0건 (시험 데이터 유출 방지)
- 모든 파일은 로컬에만 저장
- Tauri CSP 엄격 설정

### 12.3 접근성
- 키보드만으로 모든 조작 가능
- 스크린 리더 호환 (ARIA 라벨)
- 색약 대비 (경고 표시는 색 + 아이콘 조합)

### 12.4 국제화
- MVP는 한국어 단일
- 구조는 i18n 가능하게 (문자열 추출, `t('key')` 패턴 권장)

---

## 13. 향후 확장 (MVP 이후)

- [ ] 선택형/서답형 분리 입력 (NEIS가 각각 별도 범주로 처리 시)
- [ ] CSV 가져오기 (기존 문항 카드에서 일괄 입력)
- [ ] 과거 시험 결과 피드백 학습 (실제 분포 → 다음 시험 σ 자동 보정)
- [ ] PDF/PNG 내보내기 (결과 리포트)
- [ ] 교과협의회용 공유 모드 (여러 교사 입력 병합, 2라운드 시뮬레이션)
- [ ] 변별도/난이도 통계 대시보드
- [ ] 2PL IRT 모델 옵션 (과거 데이터 충분 시)
- [ ] 웹 버전 (동일 계산 엔진 재사용)

---

## 14. 핵심 제약사항 체크리스트 (개발 시 절대 잊지 말 것)

- ✅ 앱 이름: **NEIS 분할점수 계산기**
- ✅ **Made by DoRm** 표기 (헤더 또는 푸터 또는 About)
- ✅ NEIS 양식 동일 레이아웃 (3행 × 5~6열, 베이지 배경)
- ✅ 5% 단위 강제 (NEIS 규정)
- ✅ 단조성 강제 (행/열)
- ✅ 완전 오프라인 (네트워크 차단)
- ✅ 실시간 계산 (입력 → 출력 < 100ms)
- ✅ 자동 저장 (앱 강제 종료 대비)
- ✅ 1PL Rasch + 표준정규 (추가 파라미터 없음)
- ✅ 목표 분포 = 학생 능력 분포로 해석 (σ 가정 회피)
- ✅ 계산 투명성 (각 셀 계산 근거 표시 가능)
- ✅ 2026 용어 변경(지필평가→정기시험) 안내
- ✅ A>40% / E>40% 권고 경고
- ✅ D/E 분할점수 40점 미만 안내

---

## 15. 참고 자료 (도움말에 출처 표기)

1. **2025학년도 고등학교 학업성적관리 시행지침** — 교육부/시도교육청
2. **2026학년도 경기도 중·고 학업성적관리 시행지침** — 경기도교육청 (지필평가 → 정기시험 변경)
3. **성취평가제 운영의 실제 (KERIS 2023)** — 분할점수 산출 방법, Angoff/Ebel, 1PL Rasch 근거
4. **4세대 지능형 NEIS 성적처리 사용자 설명서(고등학교)** — 추정분할점수관리 메뉴 경로
5. **17개 시도교육청 성취평가제 PIM 2024-13** — 추정분할점수 정의

---

## 16. 최종 메모 (Claude Code에게)

이 문서에 명시되지 않은 세부 UI 디테일(색상 팔레트, 애니메이션, 폰트 등)은 **shadcn/ui 기본값을 따르고**, 교사 친화적(명료, 낮은 인지 부하)으로 구현하세요.

계산 결과가 문서 §3.3.1의 예시와 일치하는지 유닛 테스트로 반드시 검증하세요. 이게 맞으면 핵심 로직은 정상입니다.

"Made by DoRm" 문구는 **반드시** 사용자 눈에 띄는 곳에 표시되어야 합니다. 헤더 우측 또는 푸터 중앙 권장.

개발 완료 후 `.msi` 인스톨러로 빌드하여 바로 설치 테스트 가능한 상태로 전달해주세요.

— 끝 —
