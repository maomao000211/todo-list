/**
 * 手机端日期切换器 - Pill Tabs
 * 横向滚动的 7 天选择器
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDateToString } from '@/lib/utils/date';
import { cn } from '@/lib/utils';
import { tokens } from '@/lib/styles/tokens';

interface DaySwitcherProps {
  weekStart: Date;
  selectedDate: string;
  onSelectDate: (date: string) => void;
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

const weekdayShortMap: Record<number, string> = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
};

export function DaySwitcher({ weekStart, selectedDate, onSelectDate }: DaySwitcherProps) {
  // 客户端状态：今天的日期字符串
  const [todayStr, setTodayStr] = useState<string>('');

  useEffect(() => {
    setTodayStr(formatDateToString(new Date()));
  }, []);

  // 生成本周 7 天
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <div className="relative">
      {/* 横向滚动容器 */}
      <div className="flex gap-2 overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-1 pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 -mx-1">
        {weekDays.map((date) => {
          const dateStr = formatDateToString(date);
          const isSelected = dateStr === selectedDate;
          const isToday = todayStr === dateStr;
          const dayOfWeek = date.getDay();
          const dayNumber = date.getDate();

          return (
            <motion.button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                'flex-shrink-0 snap-start flex flex-col items-center justify-center',
                'min-w-[3.5rem] h-14 rounded-2xl border-2 transition-all duration-200',
                'active:scale-95',
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
                !isSelected && isToday && 'border-indigo-300 dark:border-indigo-700'
              )}
              whileTap={{ scale: 0.95 }}
            >
              {/* 星期：小字 */}
              <span className={cn(
                'text-xs font-medium mb-0.5',
                isSelected
                  ? 'text-indigo-100'
                  : isToday
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400'
              )}>
                {weekdayShortMap[dayOfWeek]}
              </span>

              {/* 日期：大字 */}
              <span className={cn(
                'text-lg font-bold leading-none',
                isSelected
                  ? 'text-white'
                  : isToday
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : tokens.textPrimary
              )}>
                {dayNumber}
              </span>

              {/* 今天小点 */}
              {isToday && !isSelected && (
                <span className="absolute bottom-1.5 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 底部渐变遮罩（可选，提示可滚动） */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none" />
    </div>
  );
}
