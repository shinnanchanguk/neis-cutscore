import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { helpContent } from '@/content/help';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sectionStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: '#1A1A1A',
  marginBottom: '6px',
  letterSpacing: '0.02em',
};

const sectionContentStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#6B6861',
  lineHeight: '1.65',
  whiteSpace: 'pre-line',
};

const scrollPanelStyle: React.CSSProperties = {
  maxHeight: '360px',
  overflowY: 'auto',
  paddingRight: '4px',
};

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        <DialogHeader>
          <DialogTitle style={{ fontSize: '13px', fontWeight: 500 }}>
            도움말
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="concepts">
          <TabsList>
            <TabsTrigger value="concepts" style={{ fontSize: '11px' }}>
              {helpContent.concepts.title}
            </TabsTrigger>
            <TabsTrigger value="math" style={{ fontSize: '11px' }}>
              {helpContent.mathModel.title}
            </TabsTrigger>
            <TabsTrigger value="faq" style={{ fontSize: '11px' }}>
              {helpContent.faq.title}
            </TabsTrigger>
            <TabsTrigger value="about" style={{ fontSize: '11px' }}>
              {helpContent.about.title}
            </TabsTrigger>
          </TabsList>

          {/* 개념 설명 */}
          <TabsContent value="concepts">
            <div style={scrollPanelStyle}>
              {helpContent.concepts.sections.map((sec) => (
                <div key={sec.title} style={sectionStyle}>
                  <p style={sectionTitleStyle}>{sec.title}</p>
                  <p style={sectionContentStyle}>{sec.content}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 계산 원리 */}
          <TabsContent value="math">
            <div style={scrollPanelStyle}>
              {helpContent.mathModel.sections.map((sec) => (
                <div key={sec.title} style={sectionStyle}>
                  <p style={sectionTitleStyle}>{sec.title}</p>
                  <p style={sectionContentStyle}>{sec.content}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <div style={scrollPanelStyle}>
              {helpContent.faq.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    ...sectionStyle,
                    paddingBottom: '16px',
                    borderBottom: i < helpContent.faq.items.length - 1 ? '1px solid #D4D1C9' : 'none',
                  }}
                >
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1A1A1A',
                      marginBottom: '6px',
                    }}
                  >
                    Q. {item.q}
                  </p>
                  <p style={sectionContentStyle}>A. {item.a}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* About */}
          <TabsContent value="about">
            <div style={scrollPanelStyle}>
              <div style={sectionStyle}>
                <p style={sectionTitleStyle}>버전</p>
                <p style={sectionContentStyle}>{helpContent.about.version}</p>
              </div>
              <div style={sectionStyle}>
                <p style={sectionTitleStyle}>제작</p>
                <p style={sectionContentStyle}>{helpContent.about.credit}</p>
              </div>
              <div style={sectionStyle}>
                <p style={sectionTitleStyle}>참고 문서</p>
                <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
                  {helpContent.about.references.map((ref, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: '12px',
                        color: '#6B6861',
                        lineHeight: '1.65',
                        paddingLeft: '12px',
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          color: '#D4D1C9',
                        }}
                      >
                        —
                      </span>
                      {ref}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
