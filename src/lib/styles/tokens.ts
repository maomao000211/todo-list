/**
 * UI 设计 Tokens
 * 统一的颜色、间距、圆角、阴影配置
 */

export const tokens = {
  // 间距 scale
  spacing: {
    xs: '4px',   // 0.25rem
    sm: '8px',   // 0.5rem
    md: '12px',  // 0.75rem
    lg: '16px',  // 1rem
    xl: '24px',  // 1.5rem
    '2xl': '32px', // 2rem
  },

  // 圆角
  radius: {
    sm: '0.5rem',   // 8px - 小元素
    md: '0.75rem',  // 12px - 卡片
    lg: '1rem',     // 16px - 容器
    xl: '1.5rem',   // 24px - 大容器
    full: '9999px', // 圆形/胶囊
  },

  // 阴影
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
  },

  // 颜色 - 统计卡片背景
  statsBg: {
    done: 'bg-emerald-50 dark:bg-emerald-950/30',
    todo: 'bg-amber-50 dark:bg-amber-950/30',
    total: 'bg-blue-50 dark:bg-blue-950/30',
    rate: 'bg-purple-50 dark:bg-purple-950/30',
  },

  // 颜色 - 统计卡片文字
  statsText: {
    done: 'text-emerald-700 dark:text-emerald-300',
    todo: 'text-amber-700 dark:text-amber-300',
    total: 'text-blue-700 dark:text-blue-300',
    rate: 'text-purple-700 dark:text-purple-300',
  },

  // 文字颜色
  textPrimary: 'text-slate-900 dark:text-slate-100',
  textSecondary: 'text-slate-600 dark:text-slate-400',
  textMuted: 'text-slate-500 dark:text-slate-500',

  // 渐变 - Header
  headerGradient: 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950',

  // 边框
  border: 'border-slate-200/60 dark:border-slate-700/60',

  // 最大宽度
  maxWidth: 'max-w-7xl',
};

// Tailwind class 映射（用于直接使用）
export const cn = {
  // 容器圆角
  containerRadius: 'rounded-2xl',
  cardRadius: 'rounded-xl',
  pillRadius: 'rounded-full',

  // 阴影
  shadowSm: 'shadow-sm',
  shadowMd: 'shadow-md',

  // 间距
  gapSm: 'gap-2',
  gapMd: 'gap-3',
  gapLg: 'gap-4',
  gapXl: 'gap-6',

  // 内边距
  pSm: 'p-3',
  pMd: 'p-4',
  pLg: 'p-6',

  // 文字
  textPrimary: 'text-slate-900 dark:text-slate-100',
  textSecondary: 'text-slate-600 dark:text-slate-400',
  textMuted: 'text-slate-500 dark:text-slate-500',

  // 按钮
  buttonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  buttonGhost: 'hover:bg-slate-100 dark:hover:bg-slate-800',
};
