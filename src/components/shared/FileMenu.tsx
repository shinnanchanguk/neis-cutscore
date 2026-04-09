import { useEffect } from 'react';
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
    const project = await openProject();
    if (project) {
      store.loadProject(project);
    }
  };

  const handleSave = async () => {
    const project = store.exportProject();
    if (currentFilePath) {
      await saveProjectToPath(currentFilePath, project);
    } else {
      const path = await saveProjectAs(project);
      if (path) {
        useExamStore.setState({ currentFilePath: path });
      }
    }
  };

  const handleSaveAs = async () => {
    const project = store.exportProject();
    const path = await saveProjectAs(project);
    if (path) {
      useExamStore.setState({ currentFilePath: path });
    }
  };

  const handleOpenRecent = async (path: string) => {
    const project = await openProjectFromPath(path);
    if (project) {
      store.loadProject(project);
      useExamStore.setState({ currentFilePath: path });
    }
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
        <DropdownMenuItem onSelect={handleNew}>
          새 시험
          <DropdownMenuShortcut>Ctrl+N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void handleOpen()}>
          열기...
          <DropdownMenuShortcut>Ctrl+O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void handleSave()}>
          저장
          <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void handleSaveAs()}>
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
                    onSelect={() => void handleOpenRecent(path)}
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
