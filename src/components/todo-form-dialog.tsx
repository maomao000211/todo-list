/**
 * 待办事项表单弹窗 - 支持时间段
 */

'use client';

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Todo, CreateTodoInput } from '@/types/todo';
import { useTodoForm, TodoFormData } from '@/lib/hooks/use-todo-form';
import { cn } from '@/lib/utils';
import { tokens } from '@/lib/styles/tokens';

interface TodoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTodoInput) => void;
  editingTodo?: Todo | null;
  defaultDate?: string;
}

export function TodoFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editingTodo,
  defaultDate,
}: TodoFormDialogProps) {
  const isEditing = !!editingTodo;

  const form = useTodoForm(
    isEditing
      ? {
          title: editingTodo.title,
          description: editingTodo.description,
          date: editingTodo.date,
          startTime: editingTodo.startTime || '',
          endTime: editingTodo.endTime || '',
        }
      : {
          date: defaultDate || new Date().toISOString().split('T')[0],
        }
  );

  // 重置表单当弹窗打开且没有编辑项时
  useEffect(() => {
    if (open && !isEditing) {
      form.reset({
        title: '',
        description: '',
        date: defaultDate || new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
      });
    }
  }, [open, isEditing, defaultDate, form]);

  const handleSubmit = (data: TodoFormData) => {
    const input: CreateTodoInput = {
      title: data.title,
      description: data.description || undefined,
      date: data.date,
      startTime: data.startTime || undefined,
      endTime: data.endTime || undefined,
    };
    onSubmit(input);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        'sm:max-w-[460px] rounded-2xl',
        'border-slate-200/60 dark:border-slate-700/60'
      )}>
        <DialogHeader className="space-y-1">
          <DialogTitle className={cn(
            'text-xl font-semibold',
            tokens.textPrimary
          )}>
            {isEditing ? '编辑任务' : '新建任务'}
          </DialogTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isEditing ? '修改任务信息' : '填写下方信息创建新任务'}
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 pt-2">
          {/* 标题 */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              标题 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="输入任务标题"
              className={cn(
                'rounded-xl',
                'border-slate-200/60 dark:border-slate-700/60',
                'focus:border-indigo-500 focus:ring-indigo-500/20'
              )}
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* 日期 */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              日期 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              className={cn(
                'rounded-xl',
                'border-slate-200/60 dark:border-slate-700/60',
                'focus:border-indigo-500 focus:ring-indigo-500/20'
              )}
              {...form.register('date')}
            />
            {form.formState.errors.date && (
              <p className="text-sm text-red-500">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          {/* 时间段：开始时间 - 结束时间 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              时间段（可选）
            </Label>
            <div className="flex items-center gap-2">
              {/* 开始时间 */}
              <div className="flex-1">
                <Input
                  id="startTime"
                  type="time"
                  placeholder="开始时间"
                  className={cn(
                    'rounded-xl',
                    'border-slate-200/60 dark:border-slate-700/60',
                    'focus:border-indigo-500 focus:ring-indigo-500/20'
                  )}
                  {...form.register('startTime')}
                />
                {form.formState.errors.startTime && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.startTime.message}
                  </p>
                )}
              </div>

              <span className="text-slate-400 flex-shrink-0">—</span>

              {/* 结束时间 */}
              <div className="flex-1">
                <Input
                  id="endTime"
                  type="time"
                  placeholder="结束时间"
                  className={cn(
                    'rounded-xl',
                    'border-slate-200/60 dark:border-slate-700/60',
                    'focus:border-indigo-500 focus:ring-indigo-500/20',
                    !form.watch('startTime') && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={!form.watch('startTime')}
                  {...form.register('endTime')}
                />
                {form.formState.errors.endTime && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.endTime.message}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              设置开始时间后可设置结束时间
            </p>
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              描述
            </Label>
            <Textarea
              id="description"
              placeholder="输入任务描述（可选）"
              rows={3}
              className={cn(
                'rounded-xl resize-none',
                'border-slate-200/60 dark:border-slate-700/60',
                'focus:border-indigo-500 focus:ring-indigo-500/20'
              )}
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* 按钮 */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={cn(
                'rounded-full px-6',
                'border-slate-200/60 dark:border-slate-700/60'
              )}
            >
              取消
            </Button>
            <Button
              type="submit"
              className={cn(
                'rounded-full px-6',
                'bg-indigo-600 hover:bg-indigo-700',
                'text-white shadow-md hover:shadow-lg'
              )}
            >
              {isEditing ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
