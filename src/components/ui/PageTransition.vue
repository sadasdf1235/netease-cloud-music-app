<template>
  <Transition
    name="page"
    mode="out-in"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </Transition>
</template>

<script setup lang="ts">
/**
 * 页面过渡组件
 * @description 提供页面切换动画效果
 */
import { gsap } from 'gsap';

/**
 * 进入动画开始前
 */
function beforeEnter(el: Element) {
  gsap.set(el, {
    opacity: 0,
    y: 20
  });
}

/**
 * 进入动画
 */
function enter(el: Element, done: () => void) {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.3,
    ease: 'power2.out',
    onComplete: done
  });
}

/**
 * 进入动画结束后
 */
function afterEnter(el: Element) {
  gsap.set(el, { clearProps: 'all' });
}

/**
 * 离开动画开始前
 */
function beforeLeave(el: Element) {
  gsap.set(el, {
    opacity: 1,
    y: 0
  });
}

/**
 * 离开动画
 */
function leave(el: Element, done: () => void) {
  gsap.to(el, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done
  });
}

/**
 * 离开动画结束后
 */
function afterLeave(el: Element) {
  gsap.set(el, { clearProps: 'all' });
}
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style> 