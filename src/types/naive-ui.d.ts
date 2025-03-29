/**
 * Naive UI类型声明
 * @description 为Naive UI组件提供类型声明
 */

declare module 'naive-ui' {
  import { DefineComponent, ComputedRef, Ref } from 'vue';
  
  // 消息API
  export interface MessageOptions {
    content: string;
    duration?: number;
    closable?: boolean;
    keepAliveOnHover?: boolean;
    icon?: boolean;
    type?: 'info' | 'success' | 'warning' | 'error';
    render?: () => VNode;
    onAfterLeave?: () => void;
    onClose?: () => void;
  }
  
  export interface MessageReactive {
    content: string;
    duration: number;
    closable: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
    icon: boolean;
    destroy: () => void;
  }
  
  export interface MessageApiInjection {
    info(content: string | MessageOptions): MessageReactive;
    success(content: string | MessageOptions): MessageReactive;
    warning(content: string | MessageOptions): MessageReactive;
    error(content: string | MessageOptions): MessageReactive;
    create(content: string | MessageOptions): MessageReactive;
  }
  
  export type MessageApi = MessageApiInjection;
  
  export function useMessage(): MessageApi;
  
  // 组件类型
  export const NSpin: DefineComponent<{
    description?: string;
    stroke?: string;
    size?: string | number;
    show?: boolean;
    rotate?: boolean;
    spinning?: boolean;
  }>;
  
  export const NButton: DefineComponent<{
    type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';
    size?: 'tiny' | 'small' | 'medium' | 'large';
    text?: boolean;
    block?: boolean;
    loading?: boolean;
    disabled?: boolean;
    circle?: boolean;
    color?: string;
    ghost?: boolean;
    dashed?: boolean;
    round?: boolean;
    secondary?: boolean;
    tertiary?: boolean;
    quaternary?: boolean;
    strong?: boolean;
    onClick?: (e: MouseEvent) => void;
  }>;
} 