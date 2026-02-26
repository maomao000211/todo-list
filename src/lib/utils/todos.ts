/**
 * 待办事项分组和统计工具
 */

import { Todo, TodosByDate, WeekStats } from '@/types/todo';
import { formatDateToString, getWeekStart, getWeekEnd } from './date';

/**
 * 按日期分组待办事项
 */
export function groupTodosByDate(todos: Todo[]): TodosByDate {
  const grouped: TodosByDate = {};

  for (const todo of todos) {
    if (!grouped[todo.date]) {
      grouped[todo.date] = [];
    }
    grouped[todo.date].push(todo);
  }

  // 对每个日期的任务按时间排序
  for (const date in grouped) {
    grouped[date].sort((a, b) => {
      // 有开始时间的排前面，没有开始时间的排后面
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  return grouped;
}

/**
 * 计算周统计数据
 */
export function calcWeekStats(todos: Todo[]): WeekStats {
  const total = todos.length;
  const done = todos.filter((t) => t.done).length;
  const todo = total - done;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return { done, todo, total, pct };
}

/**
 * 获取本周的日期范围字符串
 */
export function getWeekDateStrings(baseDate: Date = new Date()): {
  startDate: string;
  endDate: string;
} {
  const weekStart = getWeekStart(baseDate);
  const weekEnd = getWeekEnd(baseDate);

  return {
    startDate: formatDateToString(weekStart),
    endDate: formatDateToString(weekEnd),
  };
}

/**
 * 过滤指定日期范围内的待办事项
 */
export function filterTodosByDateRange(
  todos: Todo[],
  startDate: string,
  endDate: string
): Todo[] {
  return todos.filter((todo) => todo.date >= startDate && todo.date <= endDate);
}

/**
 * 创建空的一周待办映射（周一到周日）
 */
export function createEmptyWeekMap(weekStart: Date): TodosByDate {
  const map: TodosByDate = {};
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return formatDateToString(date);
  });

  for (const dateStr of weekDates) {
    map[dateStr] = [];
  }

  return map;
}

/**
 * 将待办事项合并到周映射中
 */
export function mergeTodosIntoWeekMap(
  weekMap: TodosByDate,
  todos: Todo[]
): TodosByDate {
  const result = { ...weekMap };

  for (const todo of todos) {
    if (result[todo.date]) {
      result[todo.date].push(todo);
    }
  }

  // 排序每个日期的任务
  for (const date in result) {
    result[date].sort((a, b) => {
      // 有开始时间的排前面，没有开始时间的排后面
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  return result;
}
