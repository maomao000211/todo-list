import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';

/**
 * 数据库 Schema 定义
 */
interface TodoDB extends DBSchema {
  todos: {
    key: string;
    value: Todo;
    indexes: {
      'by-date': string;
      'by-created': number;
    };
  };
}

const DB_NAME = 'todo-calendar-db';
const DB_VERSION = 1;
const STORE_NAME = 'todos';

/**
 * IndexedDB 实现类
 */
class IndexedDBStorage {
  private db: IDBPDatabase<TodoDB> | null = null;
  private initPromise: Promise<IDBPDatabase<TodoDB>> | null = null;

  /**
   * 初始化数据库连接
   */
  private async init(): Promise<IDBPDatabase<TodoDB>> {
    if (this.db) return this.db;

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        const db = await openDB<TodoDB>(DB_NAME, DB_VERSION, {
          upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
              store.createIndex('by-date', 'date');
              store.createIndex('by-created', 'createdAt');
            }
          },
        });
        this.db = db;
        return db;
      } catch (error) {
        this.initPromise = null;
        throw error;
      }
    })();

    return this.initPromise;
  }

  /**
   * 列出所有待办事项
   */
  async listAll(): Promise<Todo[]> {
    try {
      const db = await this.init();
      return await db.getAll(STORE_NAME);
    } catch (error) {
      console.error('IndexedDB listAll error:', error);
      throw error;
    }
  }

  /**
   * 按日期范围查询待办事项
   */
  async listByDateRange(startDate: string, endDate: string): Promise<Todo[]> {
    try {
      const db = await this.init();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const index = tx.store.index('by-date');

      const todos: Todo[] = [];

      // 使用游标遍历日期范围
      let cursor = await index.openCursor(IDBKeyRange.bound(startDate, endDate, false, false));

      while (cursor) {
        todos.push(cursor.value);
        cursor = await cursor.continue();
      }

      await tx.done;
      return todos;
    } catch (error) {
      console.error('IndexedDB listByDateRange error:', error);
      throw error;
    }
  }

  /**
   * 获取单个待办事项
   */
  async get(id: string): Promise<Todo | undefined> {
    try {
      const db = await this.init();
      return await db.get(STORE_NAME, id);
    } catch (error) {
      console.error('IndexedDB get error:', error);
      throw error;
    }
  }

  /**
   * 创建待办事项
   */
  async create(input: CreateTodoInput): Promise<Todo> {
    try {
      const db = await this.init();
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
      await db.put(STORE_NAME, todo);
      return todo;
    } catch (error) {
      console.error('IndexedDB create error:', error);
      throw error;
    }
  }

  /**
   * 更新待办事项
   */
  async update(input: UpdateTodoInput): Promise<Todo | undefined> {
    try {
      const db = await this.init();
      const existing = await db.get(STORE_NAME, input.id);
      if (!existing) return undefined;

      const updated: Todo = {
        ...existing,
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.date !== undefined && { date: input.date }),
        ...(input.startTime !== undefined && { startTime: input.startTime }),
        ...(input.endTime !== undefined && { endTime: input.endTime }),
        ...(input.done !== undefined && { done: input.done }),
        updatedAt: Date.now(),
      };

      await db.put(STORE_NAME, updated);
      return updated;
    } catch (error) {
      console.error('IndexedDB update error:', error);
      throw error;
    }
  }

  /**
   * 删除待办事项
   */
  async remove(id: string): Promise<boolean> {
    try {
      const db = await this.init();
      await db.delete(STORE_NAME, id);
      return true;
    } catch (error) {
      console.error('IndexedDB remove error:', error);
      throw error;
    }
  }

  /**
   * 切换待办事项完成状态
   */
  async toggleDone(id: string): Promise<Todo | undefined> {
    try {
      const existing = await this.get(id);
      if (!existing) return undefined;
      return await this.update({ id, done: !existing.done });
    } catch (error) {
      console.error('IndexedDB toggleDone error:', error);
      throw error;
    }
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<void> {
    try {
      const db = await this.init();
      await db.clear(STORE_NAME);
    } catch (error) {
      console.error('IndexedDB clear error:', error);
      throw error;
    }
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 检查 IndexedDB 是否可用
   */
  static isAvailable(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }
}

// 导出单例
export const indexedDBStorage = new IndexedDBStorage();
