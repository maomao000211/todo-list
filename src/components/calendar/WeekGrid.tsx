/**
 * 周网格组件 - 紧凑优化版 + 密度支持
 * 特点：真正的日历格子感、移动端横滑 snap、桌面端 7 列
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Todo, TodosByDate } from '@/types/todo';
import { DayColumn } from './DayColumn';
import { cn, getWeekDates, formatDateToString } from '@/lib/utils';
import { tokens } from '@/lib/styles/tokens';

interface WeekGridProps {
  weekStart: Date;
  todosByDate: TodosByDate;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onCopy?: (todo: Todo) => void;
  onCreate: (date: string) => void;
  hideCompleted: boolean;
  density?: 'compact' | 'comfortable';
  weekKey: string;
}

export function WeekGrid({
  weekStart,
  todosByDate,
  onToggle,
  onEdit,
  onDelete,
  onCopy,
  onCreate,
  hideCompleted,
  density = 'compact',
  weekKey,
}: WeekGridProps) {
  const weekDates = getWeekDates(weekStart);

  // 检查本周是否有任何任务
  const hasAnyTodos = Object.values(todosByDate).some(
    todos => todos && todos.length > 0
  );

  return (
    <div className={cn(
      'container mx-auto px-4 md:px-6 flex-1 min-h-0',
      tokens.maxWidth
    )}>
      <AnimatePresence mode="wait">
        <motion.div
          key={weekKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="h-full"
        >
          {/* 桌面端：7 列等宽 */}
          <div className={cn(
            'hidden md:grid md:grid-cols-7 md:gap-3 md:h-full min-h-[480px]',
            density === 'compact' ? 'min-h-[440px]' : 'min-h-[520px]'
          )}>
            {weekDates.map((date) => {
              const dateStr = formatDateToString(date);
              const todos = todosByDate[dateStr] || [];

              return (
                <div key={dateStr} className="h-full min-w-0">
                  <DayColumn
                    date={dateStr}
                    todos={todos}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onCopy={onCopy}
                    onCreate={onCreate}
                    hideCompleted={hideCompleted}
                    density={density}
                  />
                </div>
              );
            })}
          </div>

          {/* 移动端：横向滑动 */}
          <div className={cn(
            'md:hidden h-full',
            density === 'compact' ? 'min-h-[440px]' : 'min-h-[500px]'
          )}>
            {hasAnyTodos ? (
              <div className="flex gap-3 h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {weekDates.map((date) => {
                  const dateStr = formatDateToString(date);
                  const todos = todosByDate[dateStr] || [];

                  return (
                    <DayColumn
                      key={dateStr}
                      date={dateStr}
                      todos={todos}
                      onToggle={onToggle}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onCopy={onCopy}
                      onCreate={onCreate}
                      hideCompleted={hideCompleted}
                      density={density}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-6">
                  <div className={cn(
                    'w-14 h-14 rounded-2xl mx-auto mb-3',
                    'flex items-center justify-center',
                    'bg-slate-100 dark:bg-slate-800/50'
                  )}>
                    <svg
                      className="w-7 h-7 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    本周暂无任务
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    点击「新建任务」开始规划
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
