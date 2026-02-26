/**
 * 手机端日视图 - 完整任务列表
 * 一次显示一天，纵向列表布局
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo, TodosByDate } from '@/types/todo';
import { DaySwitcher } from './DaySwitcher';
import { TodoCard, TodoEmptyState } from '@/components/todo/TodoCard';
import { formatDateToString, getWeekStart } from '@/lib/utils/date';
import { cn } from '@/lib/utils';
import { tokens } from '@/lib/styles/tokens';

interface MobileDayViewProps {
  weekStart: Date;
  todosByDate: TodosByDate;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onCopy?: (todo: Todo) => void;
  onCreate: (date: string) => void;
  hideCompleted: boolean;
  weekKey: string;
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

const monthMap: Record<number, string> = {
  0: '1月', 1: '2月', 2: '3月', 3: '4月',
  4: '5月', 5: '6月', 6: '7月', 7: '8月',
  8: '9月', 9: '10月', 10: '11月', 11: '12月',
};

export function MobileDayView({
  weekStart,
  todosByDate,
  onToggle,
  onEdit,
  onDelete,
  onCopy,
  onCreate,
  hideCompleted,
  weekKey,
}: MobileDayViewProps) {
  // 客户端状态：今天的日期字符串
  const [todayStr, setTodayStr] = useState<string>('');

  // 默认选中周一（服务器端/客户端一致）
  const [selectedDate, setSelectedDate] = useState(() => {
    return formatDateToString(weekStart);
  });

  // 客户端挂载后，设置今天并选中今天（如果在本周）
  useEffect(() => {
    const today = formatDateToString(new Date());
    setTodayStr(today);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return formatDateToString(date);
    });
    if (weekDates.includes(today)) {
      setSelectedDate(today);
    }
  }, [weekKey]);

  // 获取选中日期的任务
  const dayTodos = todosByDate[selectedDate] || [];
  const filteredTodos = hideCompleted
    ? dayTodos.filter((t) => !t.done)
    : dayTodos;

  // 格式化日期标题
  const selectedDateObj = new Date(selectedDate + 'T00:00:00');
  const isToday = todayStr === selectedDate;
  const weekday = weekdayMap[selectedDateObj.getDay()];
  const month = monthMap[selectedDateObj.getMonth()];
  const dayNumber = selectedDateObj.getDate();
  const dateTitle = `${weekday}, ${month}${dayNumber}日`;

  // 左右切换日期
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate + 'T00:00:00');
    newDate.setDate(newDate.getDate() - 1);
    // 不超出本周范围
    const weekStartDate = getWeekStart(weekStart);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    if (newDate >= weekStartDate && newDate <= weekEndDate) {
      setSelectedDate(formatDateToString(newDate));
    }
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate + 'T00:00:00');
    newDate.setDate(newDate.getDate() + 1);
    // 不超出本周范围
    const weekStartDate = getWeekStart(weekStart);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    if (newDate >= weekStartDate && newDate <= weekEndDate) {
      setSelectedDate(formatDateToString(newDate));
    }
  };

  // 触摸滑动支持
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextDay();
    }
    if (isRightSwipe) {
      handlePreviousDay();
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 pb-6">
      {/* DaySwitcher - 顶部日期切换器 */}
      <div className="flex-shrink-0 mb-4">
        <DaySwitcher
          weekStart={weekStart}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* 日期标题区 - 显示当前选中日期 */}
      <div className="flex-shrink-0 flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className={cn(
            'text-lg font-bold',
            tokens.textPrimary
          )}>
            {dateTitle}
          </h2>
          {isToday && (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-indigo-600 text-white">
              今天
            </span>
          )}
        </div>

        {/* 任务计数 */}
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {filteredTodos.length} 个任务
        </span>
      </div>

      {/* 任务列表区 - 可滚动 */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {filteredTodos.length === 0 ? (
              <TodoEmptyState date={selectedDate} density="comfortable" />
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
                  density="comfortable"
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 滑动提示 */}
      <div className="flex-shrink-0 mt-3 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          左右滑动切换日期
        </p>
      </div>
    </div>
  );
}
