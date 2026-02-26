/**
 * 统一存储接口
 * 自动选择 IndexedDB 或 localStorage 降级
 */

import { indexedDBStorage } from './indexeddb';
import { localStorageStorage } from './storage-fallback';
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';

// 检查 IndexedDB 是否可用
function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

class Storage {
  private db: typeof indexedDBStorage | typeof localStorageStorage;

  constructor() {
    // 优先使用 IndexedDB，不可用时降级到 localStorage
    if (isIndexedDBAvailable()) {
      this.db = indexedDBStorage;
      console.log('Using IndexedDB for storage');
    } else {
      this.db = localStorageStorage;
      console.log('Using localStorage for storage');
    }
  }

  /**
   * 列出所有待办事项
   */
  async listAll(): Promise<Todo[]> {
    return this.db.listAll();
  }

  /**
   * 按日期范围查询待办事项
   */
  async listByDateRange(startDate: string, endDate: string): Promise<Todo[]> {
    return this.db.listByDateRange(startDate, endDate);
  }

  /**
   * 获取单个待办事项
   */
  async get(id: string): Promise<Todo | undefined> {
    return this.db.get(id);
  }

  /**
   * 创建待办事项
   */
  async create(input: CreateTodoInput): Promise<Todo> {
    return this.db.create(input);
  }

  /**
   * 更新待办事项
   */
  async update(input: UpdateTodoInput): Promise<Todo | undefined> {
    return this.db.update(input);
  }

  /**
   * 删除待办事项
   */
  async remove(id: string): Promise<boolean> {
    return this.db.remove(id);
  }

  /**
   * 切换待办事项完成状态
   */
  async toggleDone(id: string): Promise<Todo | undefined> {
    return this.db.toggleDone(id);
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<void> {
    return this.db.clear();
  }
}

// 导出单例
export const storage = new Storage();

// 重新导出类型
export type { Todo, CreateTodoInput, UpdateTodoInput };
