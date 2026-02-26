import { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';

const STORAGE_KEY = 'todo-calendar-data';

/**
 * localStorage 降级实现类
 */
class LocalStorageStorage {
  private getData(): Todo[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('localStorage read error:', error);
      return [];
    }
  }

  private setData(data: Todo[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('localStorage write error:', error);
    }
  }

  /**
   * 列出所有待办事项
   */
  async listAll(): Promise<Todo[]> {
    return this.getData();
  }

  /**
   * 按日期范围查询待办事项
   */
  async listByDateRange(startDate: string, endDate: string): Promise<Todo[]> {
    const todos = this.getData();
    return todos.filter(
      (todo) => todo.date >= startDate && todo.date <= endDate
    );
  }

  /**
   * 获取单个待办事项
   */
  async get(id: string): Promise<Todo | undefined> {
    const todos = this.getData();
    return todos.find((todo) => todo.id === id);
  }

  /**
   * 创建待办事项
   */
  async create(input: CreateTodoInput): Promise<Todo> {
    const todos = this.getData();
    const now = Date.now();
    const todo: Todo = {
      id: this.generateId(),
      title: input.title,
      description: input.description,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      done: false,
      createdAt: now,
      updatedAt: now,
    };
    todos.push(todo);
    this.setData(todos);
    return todo;
  }

  /**
   * 更新待办事项
   */
  async update(input: UpdateTodoInput): Promise<Todo | undefined> {
    const todos = this.getData();
    const index = todos.findIndex((todo) => todo.id === input.id);
    if (index === -1) return undefined;

    const updated: Todo = {
      ...todos[index],
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.date !== undefined && { date: input.date }),
      ...(input.startTime !== undefined && { startTime: input.startTime }),
      ...(input.endTime !== undefined && { endTime: input.endTime }),
      ...(input.done !== undefined && { done: input.done }),
      updatedAt: Date.now(),
    };

    todos[index] = updated;
    this.setData(todos);
    return updated;
  }

  /**
   * 删除待办事项
   */
  async remove(id: string): Promise<boolean> {
    const todos = this.getData();
    const filtered = todos.filter((todo) => todo.id !== id);
    if (filtered.length === todos.length) return false;
    this.setData(filtered);
    return true;
  }

  /**
   * 切换待办事项完成状态
   */
  async toggleDone(id: string): Promise<Todo | undefined> {
    const todos = this.getData();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return undefined;
    return await this.update({ id, done: !todo.done });
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 导出单例
export const localStorageStorage = new LocalStorageStorage();
