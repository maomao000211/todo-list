/**
 * 复制任务到其他日期弹窗 - UI 优化版（支持时间段）
 */

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import { Todo, CreateTodoInput } from '@/types/todo';
import { cn } from '@/lib/utils';
import { tokens } from '@/lib/styles/tokens';

interface CopyToDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTodoInput) => void;
  todo: Todo | null;
}

// 格式化时间段显示
function formatTimeRange(todo: Todo): string {
  if (!todo.startTime) return '';
  if (todo.endTime) {
    return `${todo.startTime} - ${todo.endTime}`;
  }
  return todo.startTime;
}

export function CopyToDialog({
  open,
  onOpenChange,
  onSubmit,
  todo,
}: CopyToDialogProps) {
  const [targetDate, setTargetDate] = useState('');

  // 重置状态当弹窗关闭时
  useEffect(() => {
    if (!open) {
      setTargetDate('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (!todo || !targetDate) return;

    const input: CreateTodoInput = {
      title: todo.title,
      description: todo.description,
      date: targetDate,
      startTime: todo.startTime,
      endTime: todo.endTime,
    };

    onSubmit(input);
    setTargetDate('');
  };

  const timeDisplay = todo ? formatTimeRange(todo) : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        'sm:max-w-[380px] rounded-2xl',
        'border-slate-200/60 dark:border-slate-700/60'
      )}>
        <DialogHeader className="space-y-1">
          <div className={cn(
            'w-12 h-12 rounded-xl',
            'flex items-center justify-center mb-2',
            'bg-indigo-100 dark:bg-indigo-950/50'
          )}>
            <Copy className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <DialogTitle className={cn(
            'text-xl font-semibold',
            tokens.textPrimary
          )}>
            复制任务
          </DialogTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            选择目标日期复制此任务
          </p>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* 任务预览 */}
          {todo && (
            <div className={cn(
              'p-3 rounded-xl',
              'bg-slate-50 dark:bg-slate-800/50',
              'border border-slate-200/60 dark:border-slate-700/60'
            )}>
              <div className="flex items-center gap-2">
                {timeDisplay && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
                    {timeDisplay}
                  </span>
                )}
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {todo.title}
                </p>
              </div>
              {todo.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {todo.description}
                </p>
              )}
            </div>
          )}

          {/* 日期选择 */}
          <div className="space-y-2">
            <Label htmlFor="target-date" className="text-sm font-medium">
              目标日期
            </Label>
            <Input
              id="target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className={cn(
                'rounded-xl',
                'border-slate-200/60 dark:border-slate-700/60',
                'focus:border-indigo-500 focus:ring-indigo-500/20'
              )}
            />
          </div>

          {/* 按钮 */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={cn(
                'rounded-full px-5',
                'border-slate-200/60 dark:border-slate-700/60'
              )}
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!targetDate}
              className={cn(
                'rounded-full px-5',
                'bg-indigo-600 hover:bg-indigo-700',
                'text-white shadow-md hover:shadow-lg',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              复制
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
