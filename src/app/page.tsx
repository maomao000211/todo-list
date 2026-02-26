/**
 * 主页面 - 周视图待办日历（响应式：桌面7列/手机日视图）
 */

'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster, toast } from 'sonner';
import { WeekHeader } from '@/components/header/WeekHeader';
import { WeekStats } from '@/components/stats/WeekStats';
import { WeekToolbar } from '@/components/toolbar/WeekToolbar';
import { WeekGrid } from '@/components/calendar/WeekGrid';
import { MobileDayView } from '@/components/mobile/MobileDayView';
import { TodoFormDialog } from '@/components/todo-form-dialog';
import { CopyToDialog } from '@/components/copy-to-dialog';
import { Plus } from 'lucide-react';
import { useWeekTodos, useCreateTodo, useUpdateTodo, useDeleteTodo, useToggleTodo } from '@/lib/hooks/use-todos';
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';
import { getWeekStart, formatDateToString } from '@/lib/utils/date';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function WeekViewContent() {
  // 当前周的周一
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart());

  // UI 状态
  const [hideCompleted, setHideCompleted] = useState(false);
  const [density, setDensity] = useState<'compact' | 'comfortable'>('compact');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [copyingTodo, setCopyingTodo] = useState<Todo | null>(null);
  const [defaultDate, setDefaultDate] = useState<string>('');

  // 数据 hooks
  const { todos, todosByDate, stats, isLoading, error } = useWeekTodos(currentWeekStart);

  // Mutations
  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();
  const toggleMutation = useToggleTodo();

  // 导航处理
  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const handleGoToToday = () => {
    setCurrentWeekStart(getWeekStart());
  };

  // CRUD 处理
  const handleCreate = (data: CreateTodoInput) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('任务创建成功');
      },
      onError: () => {
        toast.error('创建失败，请重试');
      },
    });
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleUpdate = (data: CreateTodoInput) => {
    if (!editingTodo) return;

    const updateData: UpdateTodoInput = {
      id: editingTodo.id,
      ...data,
    };

    updateMutation.mutate(updateData, {
      onSuccess: () => {
        setEditingTodo(null);
        toast.success('任务已更新');
      },
      onError: () => {
        toast.error('更新失败，请重试');
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('任务已删除');
      },
      onError: () => {
        toast.error('删除失败，请重试');
      },
    });
  };

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id);
  };

  const handleCopy = (todo: Todo) => {
    setCopyingTodo(todo);
    setIsCopyDialogOpen(true);
  };

  const handleCopySubmit = (data: CreateTodoInput) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsCopyDialogOpen(false);
        setCopyingTodo(null);
        toast.success('任务已复制');
      },
      onError: () => {
        toast.error('复制失败，请重试');
      },
    });
  };

  const handleOpenCreate = (date?: string) => {
    setDefaultDate(date || new Date().toISOString().split('T')[0]);
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  // 周 key 用于动效
  const weekKey = formatDateToString(currentWeekStart);

  // Loading 状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  // Error 状态
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">加载失败</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">请检查网络连接后重试</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            刷新页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-dvh bg-slate-50 dark:bg-slate-950 flex flex-col" suppressHydrationWarning>
      {/* 头部 */}
      <div className="flex-shrink-0">
        <WeekHeader
          weekStart={currentWeekStart}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          onGoToToday={handleGoToToday}
        />
      </div>

      {/* 统计卡片 */}
      <div className="flex-shrink-0">
        <WeekStats stats={stats} />
      </div>

      {/* 工具栏 */}
      <div className="flex-shrink-0">
        <WeekToolbar
          hideCompleted={hideCompleted}
          onHideCompletedChange={setHideCompleted}
          onCreateNew={() => handleOpenCreate()}
          density={density}
          onDensityChange={setDensity}
        />
      </div>

      {/* 主内容区 - 响应式分支 */}
      <div className="flex-1 min-h-0 px-4 md:px-6 pb-24 md:pb-6">
        <div className="container mx-auto h-full max-w-7xl">
          {/* 桌面端：7 列周视图 */}
          <div className="hidden md:block h-full">
            <WeekGrid
              weekStart={currentWeekStart}
              todosByDate={todosByDate}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onCreate={handleOpenCreate}
              hideCompleted={hideCompleted}
              density={density}
              weekKey={weekKey}
            />
          </div>

          {/* 手机端：日视图 */}
          <div className="md:hidden h-full">
            <MobileDayView
              weekStart={currentWeekStart}
              todosByDate={todosByDate}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onCreate={handleOpenCreate}
              hideCompleted={hideCompleted}
              weekKey={weekKey}
            />
          </div>
        </div>
      </div>

      {/* 移动端浮动按钮 */}
      <button
        onClick={() => handleOpenCreate()}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 active:scale-95 transition-all duration-200 flex items-center justify-center z-40"
        aria-label="新建任务"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* 弹窗 */}
      <TodoFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingTodo ? handleUpdate : handleCreate}
        editingTodo={editingTodo}
        defaultDate={defaultDate}
      />

      <CopyToDialog
        open={isCopyDialogOpen}
        onOpenChange={setIsCopyDialogOpen}
        onSubmit={handleCopySubmit}
        todo={copyingTodo}
      />

      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={2000}
      />
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeekViewContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
