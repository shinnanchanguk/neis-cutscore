import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { designStyles } from '@/components/design/styles';
import type React from 'react';

const REPO = 'shinnanchanguk/neis-cutscore-releases';

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface DownloadLink {
  label: string;
  meta: string;
  url: string;
}

export function DownloadModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [links, setLinks] = useState<DownloadLink[]>([]);
  const [version, setVersion] = useState('');

  useEffect(() => {
    if (!open) return;
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
      .then(r => r.json())
      .then(data => {
        setVersion(data.tag_name || '');
        const assets: ReleaseAsset[] = data.assets || [];
        const find = (kw: string) => assets.find(a => a.name.includes(kw))?.browser_download_url || '';
        const result: DownloadLink[] = [];
        const win = find('x64-setup.exe');
        if (win) result.push({ label: 'Windows', meta: '.exe 설치 파일', url: win });
        const macArm = find('aarch64.dmg');
        if (macArm) result.push({ label: 'macOS (Apple Silicon)', meta: '.dmg', url: macArm });
        const macIntel = find('x64.dmg');
        if (macIntel) result.push({ label: 'macOS (Intel)', meta: '.dmg', url: macIntel });
        const linux = find('AppImage');
        if (linux) result.push({ label: 'Linux', meta: '.AppImage', url: linux });
        setLinks(result);
      })
      .catch(() => {});
  }, [open]);

  const s = designStyles;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: 420, padding: 0, border: '1px solid #D4D1C9', borderRadius: 0, background: '#EBE8E3' } as React.CSSProperties}>
        <div style={{ padding: '24px' } as React.CSSProperties}>
          <h2 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px', fontFamily: s.root.fontFamily } as React.CSSProperties}>
            앱 다운로드 {version && <span style={{ fontSize: '11px', color: '#6B6861', marginLeft: 8 }}>{version}</span>}
          </h2>
          <p style={{ fontSize: '12px', color: '#6B6861', marginBottom: '20px', lineHeight: 1.6, fontFamily: s.root.fontFamily } as React.CSSProperties}>
            데스크톱 앱은 오프라인에서도 사용 가능하며,<br />파일 저장·불러오기와 자동 업데이트를 지원합니다.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' } as React.CSSProperties}>
            {links.map(link => (
              <a
                key={link.label}
                href={link.url}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#1A1A1A',
                  color: '#EBE8E3',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: s.root.fontFamily,
                } as React.CSSProperties}
              >
                <span>{link.label}</span>
                <span style={{ fontSize: '11px', opacity: 0.5 }}>{link.meta}</span>
              </a>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #D4D1C9', paddingTop: '16px' } as React.CSSProperties}>
            <p style={{ fontSize: '11px', color: '#6B6861', lineHeight: 1.7, fontFamily: s.root.fontFamily } as React.CSSProperties}>
              <strong style={{ color: '#1A1A1A' }}>설치 시 보안 경고가 나타날 수 있습니다</strong><br />
              현직 교사가 직접 제작한 무료 앱으로, 상용 코드 서명이 없어요.<br />
              Windows: "추가 정보" → "실행" 클릭<br />
              macOS: 시스템 설정 → 개인정보 보호 → "확인 없이 열기"
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
