import { DesignSection, DesignGrid2x2 } from '@/components/design';
import { useExamStore } from '@/store/examStore';

export function ExamMetaSection() {
  const meta = useExamStore((s) => s.meta);
  const setMeta = useExamStore((s) => s.setMeta);

  const fields = [
    {
      label: '학교명',
      value: meta.school,
      onChange: (v: string) => setMeta({ school: v }),
    },
    {
      label: '과목명',
      value: meta.subject,
      onChange: (v: string) => setMeta({ subject: v }),
    },
    {
      label: '학년/학기',
      value: meta.gradeLevel,
      onChange: (v: string) => setMeta({ gradeLevel: v }),
    },
    {
      label: '시험명',
      value: meta.examName,
      onChange: (v: string) => setMeta({ examName: v }),
    },
  ];

  return (
    <DesignSection
      title="시험 정보"
      hint="저장·불러오기 구분용이라 비워둬도 괜찮아요"
    >
      <DesignGrid2x2 fields={fields} />
    </DesignSection>
  );
}
