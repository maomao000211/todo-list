/**
 * Todo form validation and submission
 */

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * 时间字符串验证辅助函数
 */
const timeString = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
  message: '时间格式必须为 HH:mm',
});

/**
 * 待办事项表单验证 Schema
 */
export const todoFormSchema = z.object({
  title: z
    .string()
    .min(1, '标题不能为空')
    .max(100, '标题不能超过100个字符'),
  description: z
    .string()
    .max(500, '描述不能超过500个字符')
    .optional(),
  date: z
    .string()
    .min(1, '日期不能为空')
    .regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式必须为 YYYY-MM-DD'),
  startTime: timeString.optional().or(z.literal('')),
  endTime: timeString.optional().or(z.literal('')),
}).refine(
  (data) => {
    // 如果有结束时间，必须有开始时间
    if (data.endTime && !data.startTime) {
      return false;
    }
    return true;
  },
  {
    message: '设置结束时间时必须先设置开始时间',
    path: ['endTime'],
  }
).refine(
  (data) => {
    // 如果两个时间都存在，结束时间必须晚于开始时间
    if (data.startTime && data.endTime) {
      return data.endTime > data.startTime;
    }
    return true;
  },
  {
    message: '结束时间必须晚于开始时间',
    path: ['endTime'],
  }
);

export type TodoFormData = z.infer<typeof todoFormSchema>;

/**
 * 待办事项表单 Hook
 */
export function useTodoForm(defaultValues?: Partial<TodoFormData>) {
  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0], // 今天
      startTime: '',
      endTime: '',
      ...defaultValues,
    },
  });

  return form;
}
