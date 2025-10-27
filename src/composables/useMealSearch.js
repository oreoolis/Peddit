// PSEUDOCODE: connect search composable to backend via Pinia and match meal plans by name

/* Pseudocode notes:
 - This composable should subscribe to a Pinia store that holds public meal plans.
 - It supports debounced searching and an explicit searchNow() to run immediately.
 - Matching strategy: normalize strings to lowercase and match if plan.name includes the query.
 - Backend search: prefer calling a store action (e.g. store.fetchPublicMealPlans({ q })) that runs server-side filtering.
 - Falls back to client-side filter when full list is already present in store.
*/

import { ref, watch } from 'vue';
// import { useMealStore } from '@/stores/meal'    // Pinia store (pseudocode)

export default function useMealSearch({ debounceMs = 300 } = {}) {
  // reactive state
  const query = ref('')
  const results = ref([])         // final search results exposed to UI
  const loading = ref(false)
  const error = ref(null)

  // internal helpers / timers
  let debounceTimer = null
  let inflightRequest = null     // placeholder for AbortController / cancel token

  // Connect to Pinia store (pseudocode)
  // const mealStore = useMealStore()
  // subscribe to mealStore.publicPlans so we can use them for local filtering if available
  // watch(() => mealStore.publicPlans, (plans) => { if (!query.value) results.value = plans })

  // core search workflow (pseudocode)
  async function runSearch(q = query.value) {
    // cancel previous inflight request if supported
    // if (inflightRequest) inflightRequest.abort()

    loading.value = true
    error.value = null

    try {
      const term = (q || '').trim().toLowerCase()
      if (!term) {
        // if empty query, return store list (if available) or empty
        // results.value = mealStore.publicPlans ?? []
        results.value = [] // placeholder
        return
      }

      // Preferred: let backend do the search via a Pinia action
      // pseudocode: const res = await mealStore.fetchPublicMealPlans({ q: term, signal: inflightRequest.signal })
      // results.value = res.items || res

      // Fallback: client-side filter against store list if backend action not used:
      // const plans = mealStore.publicPlans || []
      // results.value = plans.filter(p => (p.name || '').toLowerCase().includes(term))

      // For fuzzy matching you could integrate Fuse.js here (not shown)
    } catch (e) {
      if (e.name !== 'AbortError') error.value = e
    } finally {
      loading.value = false
    }
  }

  // public: debounced watcher can call runSearch automatically when query changes
  watch(query, (val) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => runSearch(val), debounceMs)
  })

  // public API: force immediate search (useful for Enter key)
  function searchNow(q) {
    query.value = q ?? query.value
    clearTimeout(debounceTimer)
    return runSearch(query.value)
  }

  // Optional: allow parent to seed/replace the local list (still prefer store)
  function setItems(items = []) {
    // if using local items, update internal store or results directly
    results.value = Array.isArray(items) ? items.slice() : []
  }

  return {
    query,
    results,
    loading,
    error,
    searchNow,
    setItems
  }
}