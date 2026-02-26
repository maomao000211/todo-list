/**
 * 周工具栏组件 - 紧凑优化版 + 密度切换
 * 特点：半透明卡片、隐藏已完成开关、新建按钮、密度切换
 */

'use client';

import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { tokens } from '@/lib/styles/tokens';

interface WeekToolbarProps {
  hideCompleted: boolean;
  onHideCompletedChange: (value: boolean) => void;
  onCreateNew: () => void;
  density: 'compact' | 'comfortable';
  onDensityChange: (density: 'compact' | 'comfortable') => void;
}

export function WeekToolbar({
  hideCompleted,
  onHideCompletedChange,
  onCreateNew,
  density,
  onDensityChange,
}: WeekToolbarProps) {
  return (
    <div className={cn(
      'container mx-auto px-4 md:px-6 py-4',
      tokens.maxWidth
    )}>
      <div className={cn(
        'flex items-center justify-between gap-3 md:gap-4',
        'flex-wrap sm:flex-nowrap',
        'px-3 md:px-4 py-2.5 md:py-3 rounded-2xl',
        'bg-white/80 dark:bg-slate-800/80',
        'backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60',
        'shadow-sm'
      )}>
        {/* 左侧：开关组 */}
        <div className="flex items-center gap-3 md:gap-4 flex-wrap sm:flex-nowrap">
          {/* 隐藏已完成开关 */}
          <div className="flex items-center gap-2">
            <Switch
              id="hide-completed"
              checked={hideCompleted}
              onCheckedChange={onHideCompletedChange}
              className="data-[state=checked]:bg-indigo-600"
            />
            <Label
              htmlFor="hide-completed"
              className={cn(
                'text-sm font-medium cursor-pointer select-none',
                'text-slate-700 dark:text-slate-300'
              )}
            >
              <span className="hidden xs:inline">隐藏已完成</span>
              <span className="xs:hidden">隐藏已完</span>
            </Label>
          </div>

          {/* 密度切换 */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200/60 dark:border-slate-700/60">
            <span className="text-xs text-slate-500 dark:text-slate-400">密度</span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-700/50 rounded-lg p-0.5">
              <button
                onClick={() => onDensityChange('compact')}
                className={cn(
                  'px-2 py-1 rounded-md text-xs font-medium transition-all',
                  density === 'compact'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                <Minus className="h-3 w-3" />
              </button>
              <button
                onClick={() => onDensityChange('comfortable')}
                className={cn(
                  'px-2 py-1 rounded-md text-xs font-medium transition-all',
                  density === 'comfortable'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：新建任务按钮 */}
        <Button
          onClick={onCreateNew}
          className={cn(
            'rounded-full font-medium',
            'bg-indigo-600 hover:bg-indigo-700',
            'text-white shadow-md hover:shadow-lg',
            'transition-all duration-200',
            'hover:scale-105 active:scale-95',
            'h-9 px-4 text-sm'
          )}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span className="hidden sm:inline">新建任务</span>
          <span className="sm:hidden">新建</span>
        </Button>
      </div>
    </div>
  );
}
