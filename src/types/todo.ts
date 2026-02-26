/**
 * 待办事项数据模型
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm 开始时间
  endTime?: string; // HH:mm 结束时间
  done: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * 创建待办事项的输入类型
 */
export interface CreateTodoInput {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
}

/**
 * 更新待办事项的输入类型
 */
export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  done?: boolean;
}

/**
 * 周统计数据
 */
export interface WeekStats {
  done: number;
  todo: number;
  total: number;
  pct: number;
}

/**
 * 按日期分组的待办事项
 */
export type TodosByDate = Record<string, Todo[]>;
