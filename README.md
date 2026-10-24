# NEIS Cut-Score Estimator (NEIS 추정분할점수 계산기)

A desktop app for Korean secondary-school teachers. A teacher enters each exam item's points, difficulty, and expected percentage of correct answers, and the app produces the 15-cell table that the national school information system (NEIS) asks for when a school sets estimated achievement cut scores (A/B, B/C, C/D, D/E). The estimates come from a one-parameter (Rasch) item response model.

교사가 문항별 배점·난이도·예상 정답률을 넣으면, NEIS "추정분할점수 산출관리" 화면에 그대로 붙여 넣을 수 있는 15칸 표를 만들어 주는 데스크톱 앱입니다. 1모수(Rasch) 문항반응모형으로 계산합니다.

## Download

Installers for Windows, macOS, and Linux, with automatic updates: [neis-cutscore-releases](https://github.com/shinnanchanguk/neis-cutscore-releases/releases/latest)

## Built with

Tauri (Rust) · React · TypeScript · Vite

## Background

Under Korea's criterion-referenced grading system, schools may set cut scores per subject instead of the fixed 90/80/70/60 points, and the estimated cut scores are entered in NEIS as the expected correct rates of a borderline student for each item category. Guessing those rates by feel often produces unstable cut scores. This app lets teachers reason from something they can judge, the expected correct rate of each item, and converts it with an item response model.

Made by DoRm · Changuk Hong, mathematics teacher
