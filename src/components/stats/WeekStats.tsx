/**
 * 周统计卡片组件 - 视觉重构版
 * 特点：紧凑布局、带图标、颜色区分、响应式
 */

'use client';

import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { tokens } from '@/lib/styles/tokens';
import { WeekStats as WeekStatsType } from '@/types/todo';

interface WeekStatsProps {
  stats: WeekStatsType;
}

// 统计项配置
const statItems = [
  {
    key: 'done',
    label: '已完成',
    icon: CheckCircle2,
    bgClass: tokens.statsBg.done,
    textClass: tokens.statsText.done,
  },
  {
    key: 'todo',
    label: '待办',
    icon: Clock,
    bgClass: tokens.statsBg.todo,
    textClass: tokens.statsText.todo,
  },
  {
    key: 'total',
    label: '总数',
    icon: ListTodo,
    bgClass: tokens.statsBg.total,
    textClass: tokens.statsText.total,
  },
  {
    key: 'pct',
    label: '完成率',
    icon: TrendingUp,
    bgClass: tokens.statsBg.rate,
    textClass: tokens.statsText.rate,
  },
] as const;

export function WeekStats({ stats }: WeekStatsProps) {
  const StatCard = ({
    label,
    value,
    icon: Icon,
    bgClass,
    textClass,
  }: {
    label: string;
    value: number | string;
    icon: React.ElementType;
    bgClass: string;
    textClass: string;
  }) => (
    <Card className={cn(
      'border-slate-200/60 dark:border-slate-700/60 shadow-sm',
      'transition-all duration-200',
      'hover:shadow-md hover:scale-[1.02]'
    )}>
      <CardContent className={cn(
        'flex items-center gap-3 p-4',
        bgClass
      )}>
        {/* 图标 */}
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-xl',
          'flex items-center justify-center',
          'bg-white/80 dark:bg-slate-900/50',
          'shadow-sm'
        )}>
          <Icon className={cn('h-5 w-5', textClass)} />
        </div>

        {/* 数值与标签 */}
        <div className="flex-1 min-w-0">
          <div className={cn('text-2xl font-semibold', textClass)}>
            {value}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-500 mt-0.5">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn(
      'container mx-auto px-4 md:px-6 -mt-4',
      tokens.maxWidth
    )}>
      {/* 桌面端：4 列 */}
      <div className="hidden grid-cols-4 gap-3 md:grid">
        {statItems.map((item) => (
          <StatCard
            key={item.key}
            label={item.label}
            value={item.key === 'pct' ? `${stats[item.key]}%` : stats[item.key]}
            icon={item.icon}
            bgClass={item.bgClass}
            textClass={item.textClass}
          />
        ))}
      </div>

      {/* 移动端：2x2 */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {statItems.map((item) => (
          <StatCard
            key={item.key}
            label={item.label}
            value={item.key === 'pct' ? `${stats[item.key]}%` : stats[item.key]}
            icon={item.icon}
            bgClass={item.bgClass}
            textClass={item.textClass}
          />
        ))}
      </div>
    </div>
  );
}
