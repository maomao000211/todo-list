/**
 * 单日列组件 - 溢出修复版
 * 特点：三段式布局 + TaskViewport 裁切层、防止任务卡横向溢出
 */

'use client';

import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';
import { TodoCard, TodoEmptyState } from '@/components/todo/TodoCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tokens } from '@/lib/styles/tokens';

interface DayColumnProps {
  date: string;
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onCopy?: (todo: Todo) => void;
  onCreate: (date: string) => void;
  hideCompleted: boolean;
  density?: 'compact' | 'comfortable';
}

// 星期映射
const weekdayMap: Record<number, string> = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
};

// 密度配置
const densityConfig = {
  compact: {
    headerPadding: 'px-3 py-2',
    taskViewportPadding: 'px-2 py-2',
    taskSpacing: 'space-y-1.5',
    footerPadding: 'px-2 py-1.5',
    footerButtonHeight: 'h-8',
    headerTextSize: 'text-lg',
    minH: 'min-h-[420px]',
  },
  comfortable: {
    headerPadding: 'px-3 py-2.5',
    taskViewportPadding: 'px-2.5 py-2.5',
    taskSpacing: 'space-y-2',
    footerPadding: 'px-2.5 py-2',
    footerButtonHeight: 'h-9',
    headerTextSize: 'text-xl',
    minH: 'min-h-[500px]',
  },
};

// 辅助函数
const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
};

const formatDayNumber = (date: Date): string => {
  return date.getDate().toString();
};

export function DayColumn({
  date,
  todos,
  onToggle,
  onEdit,
  onDelete,
  onCopy,
  onCreate,
  hideCompleted,
  density = 'compact',
}: DayColumnProps) {
  const config = densityConfig[density];
  const dateObj = new Date(date + 'T00:00:00');
  const today = isToday(date);
  const weekday = weekdayMap[dateObj.getDay()];
  const dayNumber = formatDayNumber(dateObj);

  // 过滤已完成的任务
  const filteredTodos = hideCompleted
    ? todos.filter((t) => !t.done)
    : todos;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        // 关键修复：外层容器必须完整约束宽度
        'flex flex-col h-full w-full max-w-full min-w-0 snap-start',
        'bg-white dark:bg-slate-900/50'
      )}
    >
      {/* 日列容器 - overflow-hidden 裁切卡片阴影/transform */}
      <div className={cn(
        'flex flex-col h-full mx-2 md:mx-0 rounded-2xl border overflow-hidden',
        today
          ? 'border-indigo-300 dark:border-indigo-700'
          : 'border-slate-200/60 dark:border-slate-700/60 shadow-sm'
      )}>
        {/* ===== DayHeader：固定高度的头部 ===== */}
        <div className={cn(
          'flex-shrink-0 text-center border-b',
          config.headerPadding,
          today
            ? 'bg-indigo-50/80 dark:bg-indigo-950/20'
            : 'bg-slate-50/60 dark:bg-slate-800/30',
          'border-slate-200/60 dark:border-slate-700/60'
        )}>
          {/* 今天列：左侧细色条 */}
          {today && (
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 rounded-l-2xl" />
          )}

          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {weekday}
          </div>
          <div className={cn(
            'font-bold mt-0.5',
            config.headerTextSize,
            today ? 'text-indigo-600 dark:text-indigo-400' : tokens.textPrimary
          )}>
            {dayNumber}
          </div>
          {today && (
            <div className="flex items-center justify-center mt-1">
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full',
                'bg-indigo-600 text-white font-medium'
              )}>
                今天
              </span>
            </div>
          )}
        </div>

        {/* ===== TaskViewport：宽度约束 + 裁切层 ===== */}
        <div className={cn(
          // 关键修复：约束宽度 + 裁切溢出
          'flex-1 min-w-0 w-full max-w-full overflow-hidden'
        )}>
          {/* TaskList：可滚动的任务列表 */}
          <div className={cn(
            'overflow-y-auto overflow-x-hidden',
            config.taskViewportPadding,
            // 自定义滚动条样式
            'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-300 dark:hover:scrollbar-thumb-slate-600',
            filteredTodos.length > 0 ? config.taskSpacing : ''
          )}>
            {filteredTodos.length === 0 ? (
              <TodoEmptyState date={date} density={density} />
            ) : (
              filteredTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCopy={onCopy}
                  onClick={onEdit}
                  density={density}
                />
              ))
            )}
          </div>
        </div>

        {/* ===== DayFooter：固定在底部的新建入口 ===== */}
        <div className={cn(
          'flex-shrink-0',
          config.footerPadding,
          'bg-white/95 dark:bg-slate-800/95',
          'backdrop-blur-sm',
          'border-t border-slate-200/60 dark:border-slate-700/60'
        )}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCreate(date)}
            className={cn(
              'w-full justify-start text-slate-600 dark:text-slate-400',
              'hover:text-indigo-600 dark:hover:text-indigo-400',
              'hover:bg-indigo-50 dark:hover:bg-indigo-950/30',
              'text-sm font-medium',
              config.footerButtonHeight
            )}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            新建
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
