import { DesignLayout, DesignHeader } from '@/components/design';
import { LeftPane } from '@/components/shared/LeftPane';
import { RightPane } from '@/components/shared/RightPane';
import { TooltipProvider } from '@/components/ui/tooltip';

function App() {
  return (
    <TooltipProvider>
      <DesignLayout
        header={
          <DesignHeader
            title="NEIS 분할점수 계산기"
            subtitle="Made by DoRm"
            navItems={[
              { label: '도움말', onClick: () => {} },
              { label: '설정', onClick: () => {} },
            ]}
          />
        }
        leftPane={<LeftPane />}
        rightPane={<RightPane />}
      />
    </TooltipProvider>
  );
}

export default App;
