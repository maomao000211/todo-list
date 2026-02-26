/**
 * 日期工具函数
 */

import { format, addDays, startOfWeek, endOfWeek, parseISO, isValid } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 获取给定日期所在周的开始日期（周一）
 */
export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
}

/**
 * 获取给定日期所在周的结束日期（周日）
 */
export function getWeekEnd(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

/**
 * 获取一周的日期范围（周一到周日）
 */
export function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  return {
    start: getWeekStart(date),
    end: getWeekEnd(date),
  };
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDateToString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * 解析 YYYY-MM-DD 字符串为 Date
 */
export function parseStringToDate(dateStr: string): Date {
  return parseISO(dateStr);
}

/**
 * 获取一周的日期数组（周一到周日）
 */
export function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

/**
 * 格式化显示日期（如：周一 2/24）
 */
export function formatDisplayDate(date: Date): string {
  const dayOfMonth = format(date, 'M/d');
  const weekday = format(date, 'EEE', { locale: zhCN });
  return `${weekday} ${dayOfMonth}`;
}

/**
 * 格式化显示星期几（如：周一）
 */
export function formatWeekday(date: Date): string {
  return format(date, 'EEE', { locale: zhCN });
}

/**
 * 格式化显示日期数字（如：24）
 */
export function formatDayNumber(date: Date): string {
  return format(date, 'd');
}

/**
 * 验证日期字符串格式 (YYYY-MM-DD)
 */
export function isValidDateString(dateStr: string): boolean {
  const date = parseStringToDate(dateStr);
  return isValid(date) && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * 验证时间字符串格式 (HH:mm)
 */
export function isValidTimeString(timeStr: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr);
}

/**
 * 格式化时间显示（如：14:30）
 */
export function formatTime(timeStr: string): string {
  return timeStr; // 已经是 HH:mm 格式
}

/**
 * 判断两个日期是否是同一天
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? parseStringToDate(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseStringToDate(date2) : date2;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * 判断日期是否是今天
 */
export function isToday(date: Date | string): boolean {
  return isSameDay(date, new Date());
}
