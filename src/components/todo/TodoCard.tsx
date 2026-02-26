/**
 * 待办事项卡片组件 - 显示时间段 + 布局修复
 * 特点：单行主信息 + 可选描述行、固定操作区宽度、避免溢出
 */

'use client';

import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Copy, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tokens } from '@/lib/styles/tokens';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onCopy?: (todo: Todo) => void;
  onClick?: (todo: Todo) => void;
  density?: 'compact' | 'comfortable';
}

// 密度配置
const densityConfig = {
  compact: {
    padding: 'px-2.5 py-2',
    textSize: 'text-xs',
    timeBadge: 'px-1.5 py-0.5 text-[10px]',
    iconSize: 'h-3.5 w-3.5',
    checkboxSize: 'w-3.5 h-3.5',
    descSize: 'text-[11px]',
    actionAreaWidth: 'w-12',
  },
  comfortable: {
    padding: 'px-3 py-2',
    textSize: 'text-sm',
    timeBadge: 'px-2 py-0.5 text-xs',
    iconSize: 'h-4 w-4',
    checkboxSize: 'w-4 h-4',
    descSize: 'text-xs',
    actionAreaWidth: 'w-14',
  },
};

// 格式化时间段显示
function formatTimeRange(todo: Todo): string | null {
  if (!todo.startTime && !todo.endTime) return '全天';
  if (todo.startTime && todo.endTime) {
    return `${todo.startTime} - ${todo.endTime}`;
  }
  if (todo.startTime) return todo.startTime;
  return null;
}

export function TodoCard({
  todo,
  onToggle,
  onEdit,
  onDelete,
  onCopy,
  onClick,
  density = 'compact',
}: TodoCardProps) {
  const config = densityConfig[density];
  const isDone = todo.done;
  const timeDisplay = formatTimeRange(todo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.12 }}
      className={cn(
        'group relative w-full max-w-full min-w-0 rounded-lg border',
        config.padding,
        'transition-all duration-150',
        'hover:shadow-md hover:border-slate-300/50',
        isDone
          ? 'bg-slate-50/80 border-slate-200/30'
          : 'bg-white border-slate-200/60 shadow-sm',
        'dark:bg-slate-800/40 dark:border-slate-700/50',
        'hover:bg-white dark:hover:bg-slate-800/60',
        onClick && 'cursor-pointer'
      )}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-no-edit]') && onClick) {
          onClick(todo);
        }
      }}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {/* 左侧：时间段 badge */}
        {timeDisplay && (
          <div className={cn(
            'flex-shrink-0 rounded-md font-medium whitespace-nowrap',
            'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
            config.timeBadge
          )}>
            {timeDisplay}
          </div>
        )}

        {/* 中间：标题（弹性区域，截断） */}
        <h3
          className={cn(
            'flex-1 min-w-0 font-medium leading-snug truncate',
            config.textSize,
            isDone ? 'line-through text-slate-400' : tokens.textPrimary
          )}
        >
          {todo.title}
        </h3>

        {/* 右侧：固定宽度操作区 */}
        <div className={cn(
          'flex-shrink-0 flex items-center gap-0.5 justify-end',
          config.actionAreaWidth
        )} data-no-edit>
          {/* Checkbox */}
          <Checkbox
            checked={isDone}
            onCheckedChange={() => onToggle(todo.id)}
            className={cn(
              config.checkboxSize,
              'data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600'
            )}
          />

          {/* 更多菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'flex-shrink-0',
                  density === 'compact' ? 'h-6 w-6' : 'h-7 w-7',
                  'opacity-40 group-hover:opacity-100',
                  'transition-opacity duration-150',
                  'hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                <MoreVertical className={config.iconSize + ' text-slate-500'} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {onCopy && (
                <DropdownMenuItem onClick={() => onCopy(todo)}>
                  <Copy className="h-4 w-4 mr-2 text-slate-500" />
                  <span className="text-sm">复制</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit(todo)}>
                <Edit className="h-4 w-4 mr-2 text-slate-500" />
                <span className="text-sm">编辑</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(todo.id)}
                className="text-red-600 focus:text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="text-sm">删除</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 描述行（可选，最多1行） */}
      {todo.description && (
        <p className={cn(
          'leading-relaxed truncate mt-0.5 ml-0.5',
          config.descSize,
          isDone ? 'text-slate-400' : tokens.textSecondary
        )}>
          {todo.description}
        </p>
      )}
    </motion.div>
  );
}

/**
 * 空态组件 - 支持密度
 */
interface TodoEmptyStateProps {
  date?: string;
  density?: 'compact' | 'comfortable';
}

export function TodoEmptyState({ date, density = 'compact' }: TodoEmptyStateProps) {
  const isCompact = density === 'compact';

  return (
    <div className="flex flex-col items-center justify-center text-center py-4">
      <div className={cn(
        'rounded-lg',
        'flex items-center justify-center mb-1.5',
        'bg-slate-100 dark:bg-slate-800/50',
        isCompact ? 'w-8 h-8' : 'w-9 h-9'
      )}>
        <svg className={cn('text-slate-400', isCompact ? 'w-4 h-4' : 'w-5 h-5')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p className={cn('text-slate-500 dark:text-slate-500', isCompact ? 'text-[10px]' : 'text-xs')}>
        暂无任务
      </p>
    </div>
  );
}
