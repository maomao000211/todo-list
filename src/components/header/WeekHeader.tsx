/**
 * 周视图头部组件 - 视觉重构版
 * 特点：渐变背景、胶囊式周范围显示、布局优化
 */

'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { tokens } from '@/lib/styles/tokens';

interface WeekHeaderProps {
  weekStart: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onGoToToday: () => void;
}

export function WeekHeader({
  weekStart,
  onPreviousWeek,
  onNextWeek,
  onGoToToday,
}: WeekHeaderProps) {
  // 计算周结束日期
  const weekEnd = addDays(weekStart, 6);

  // 格式化周范围显示
  const weekRangeText = `${format(weekStart, 'M月d日', { locale: zhCN })} - ${format(weekEnd, 'M月d日', { locale: zhCN })}`;

  return (
    <header className={cn(
      'relative overflow-hidden border-b',
      tokens.headerGradient,
      tokens.border
    )}>
      {/* 装饰性背景层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5" />

      <div className={cn(
        'relative container mx-auto px-4 md:px-6 py-6 md:py-8',
        tokens.maxWidth
      )}>
        {/* 主标题行 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              一周待办清单
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              规划你的一周，达成每一个目标
            </p>
          </div>
          <Button
            onClick={onGoToToday}
            variant="outline"
            size="sm"
            className={cn(
              'rounded-full font-medium',
              'bg-white/80 backdrop-blur-sm border-slate-200/60',
              'hover:bg-white hover:shadow-md',
              'dark:bg-slate-800/80 dark:border-slate-700 dark:hover:bg-slate-800'
            )}
          >
            今天
          </Button>
        </div>

        {/* 周范围选择器 */}
        <div className="flex items-center gap-4">
          {/* 周切换按钮 */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPreviousWeek}
              className={cn(
                'rounded-full h-9 w-9',
                'hover:bg-white/60 dark:hover:bg-slate-800/60'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNextWeek}
              className={cn(
                'rounded-full h-9 w-9',
                'hover:bg-white/60 dark:hover:bg-slate-800/60'
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* 周范围胶囊 */}
          <div className={cn(
            'flex items-center gap-2 px-4 py-2',
            'rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60',
            'dark:bg-slate-800/80 dark:border-slate-700/60',
            'shadow-sm'
          )}>
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {weekRangeText}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
