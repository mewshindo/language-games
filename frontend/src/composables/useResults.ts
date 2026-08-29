import { ref } from "vue";
import { createResult, type CreateResultPayload, type Result, ApiError } from "@/services/api";

export function useResults(userId: number) {
  const results = ref<Result[]>([])
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  async function submitResult(payload: CreateResultPayload) {
    isSubmitting.value = true
    error.value = null

    try {
      const created = await createResult(userId, payload)
      results.value.unshift(created)
      return created
    } catch (caught) {
      if (caught instanceof ApiError) {
        error.value = caught.message
      } else {
        error.value = 'Something went wrong while saving the result.'
      }
      throw caught
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    results,
    isSubmitting,
    error,
    submitResult,
  }
}