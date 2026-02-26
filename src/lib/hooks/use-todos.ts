/**
 * React Query hooks for todo management
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { storage } from '@/lib/db';
import { Todo, CreateTodoInput, UpdateTodoInput, WeekStats } from '@/types/todo';
import { getWeekDateStrings, groupTodosByDate, calcWeekStats } from '@/lib/utils/todos';

// Query keys
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
  week: (weekStart: string) => [...todoKeys.all, 'week', weekStart] as const,
};

/**
 * 获取所有待办事项
 */
export function useAllTodos(): UseQueryResult<Todo[], Error> {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: () => storage.listAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * 获取指定日期范围的待办事项
 */
export function useTodosByDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: todoKeys.list({ startDate, endDate }),
    queryFn: () => storage.listByDateRange(startDate, endDate),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 获取指定周的待办事项（核心 hook）
 * 自动计算周的开始和结束日期
 */
export function useWeekTodos(baseDate: Date = new Date()) {
  const { startDate, endDate } = getWeekDateStrings(baseDate);

  const query = useQuery({
    queryKey: todoKeys.week(startDate),
    queryFn: () => storage.listByDateRange(startDate, endDate),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // 计算派生数据
  const todos = query.data || [];
  const todosByDate = groupTodosByDate(todos);
  const stats = calcWeekStats(todos);

  return {
    ...query,
    todos,
    todosByDate,
    stats,
    startDate,
    endDate,
  };
}

/**
 * 获取单个待办事项
 */
export function useTodo(id: string) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => storage.get(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 创建待办事项 mutation
 */
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) => storage.create(input),
    onSuccess: () => {
      // 使所有待办事项相关的查询失效，确保界面立即更新
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

/**
 * 更新待办事项 mutation
 */
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTodoInput) => storage.update(input),
    onSuccess: () => {
      // 使所有查询失效，确保界面立即更新
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

/**
 * 删除待办事项 mutation
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storage.remove(id),
    onSuccess: () => {
      // 使所有查询失效，确保界面立即更新
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

/**
 * 切换待办事项完成状态 mutation
 */
export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storage.toggleDone(id),
    onSuccess: () => {
      // 使所有查询失效，确保界面立即更新
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}
