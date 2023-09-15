import { ref } from 'vue';

export const useDebounce = () => {
  const timeout = ref<number | null>(null);

  const debounce = (func: () => void, wait = 500) => {
    if (timeout.value !== null) clearTimeout(timeout.value);
    timeout.value = window.setTimeout(func, wait);
  };

  return debounce;
};
