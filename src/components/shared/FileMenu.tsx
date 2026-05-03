import { useEffect } from 'react';
import { toast } from 'sonner';
import { useExamStore } from '@/store/examStore';
import { designStyles } from '@/components/design/styles';
import { saveProjectAs, saveProjectToPath, openProject, openProjectFromPath, getRecentFiles } from '@/lib/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function FileMenu() {
  const store = useExamStore();
  const currentFilePath = useExamStore((s) => s.currentFilePath);

  const handleNew = () => {
    store.resetToDefaults();
  };

  const handleOpen = async () => {
    const tid = toast.loading('파일 열기 다이얼로그 여는 중...');
    try {
      const project = await openProject();
      toast.dismiss(tid);
      if (project) {
        store.loadProject(project);
        toast.success('불러오기 완료');
      }
    } catch (e) {
      toast.dismiss(tid);
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[FileMenu] handleOpen failed:', e);
      toast.error(`열기 실패: ${msg}`, { duration: 10000 });
    }
  };

  const handleSave = async () => {
    const tid = toast.loading('저장 중...');
    const project = store.exportProject();
    try {
      if (currentFilePath) {
        await saveProjectToPath(currentFilePath, project);
        toast.dismiss(tid);
        toast.success('저장 완료');
      } else {
        const path = await saveProjectAs(project);
        toast.dismiss(tid);
        if (path) {
          useExamStore.setState({ currentFilePath: path });
          toast.success('저장 완료');
        }
      }
    } catch (e) {
      toast.dismiss(tid);
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[FileMenu] handleSave failed:', e);
      toast.error(`저장 실패: ${msg}`, { duration: 10000 });
    }
  };

  const handleSaveAs = async () => {
    const tid = toast.loading('저장 다이얼로그 여는 중...');
    const project = store.exportProject();
    try {
      const path = await saveProjectAs(project);
      toast.dismiss(tid);
      if (path) {
        useExamStore.setState({ currentFilePath: path });
        toast.success('저장 완료');
      }
    } catch (e) {
      toast.dismiss(tid);
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[FileMenu] handleSaveAs failed:', e);
      toast.error(`저장 실패: ${msg}`, { duration: 10000 });
    }
  };

  const handleOpenRecent = async (path: string) => {
    const tid = toast.loading('불러오는 중...');
    try {
      const project = await openProjectFromPath(path);
      toast.dismiss(tid);
      if (project) {
        store.loadProject(project);
        useExamStore.setState({ currentFilePath: path });
        toast.success('불러오기 완료');
      } else {
        toast.error('파일을 열 수 없습니다');
      }
    } catch (e) {
      toast.dismiss(tid);
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[FileMenu] handleOpenRecent failed:', e);
      toast.error(`열기 실패: ${msg}`, { duration: 10000 });
    }
  };

  // Radix dropdown closes on selection; native dialogs can race with that.
  // Defer to next macrotask so the menu unmounts cleanly before opening dialog.
  const deferred = (fn: () => void | Promise<void>) => () => {
    setTimeout(() => { void fn(); }, 0);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleNew();
      } else if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        void handleOpen();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (e.shiftKey) {
          void handleSaveAs();
        } else {
          void handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilePath]);

  const recentFiles = getRecentFiles();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger style={designStyles.navLink}>파일</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={deferred(handleNew)}>
          새 시험
          <DropdownMenuShortcut>Ctrl+N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={deferred(handleOpen)}>
          열기...
          <DropdownMenuShortcut>Ctrl+O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={deferred(handleSave)}>
          저장
          <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={deferred(handleSaveAs)}>
          다른 이름으로 저장...
          <DropdownMenuShortcut>Ctrl+Shift+S</DropdownMenuShortcut>
        </DropdownMenuItem>
        {recentFiles.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>최근 파일</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {recentFiles.map((path) => (
                  <DropdownMenuItem
                    key={path}
                    onSelect={deferred(() => handleOpenRecent(path))}
                    title={path}
                  >
                    {path.split(/[/\\]/).pop() ?? path}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
