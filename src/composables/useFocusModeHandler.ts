import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useFocusModeHandler(inputElement: Ref<HTMLInputElement | null>) {
  const isTyping = ref(false)

  function focusInputOnTyping(event: KeyboardEvent) {
    const target = event.target as HTMLElement

    if (event.key === 'Escape') {
      isTyping.value = false
      return
    }

    if (
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) &&
      isTyping.value == true
    ) {
      return
    }

    inputElement.value?.focus()
    isTyping.value = true
  }
  function unfocusInput() {
    isTyping.value = false
  }

  onMounted(() => {
    window.addEventListener('keydown', focusInputOnTyping)
    window.addEventListener('click', unfocusInput)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', focusInputOnTyping)
    window.removeEventListener('click', unfocusInput)
  })

  return {
    isTyping,
    focusInputOnTyping,
  }
}
