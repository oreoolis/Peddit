// src/composables/usePetInfoApi.js
import { useFetch } from "@vueuse/core";
import { ref, computed, watch } from 'vue';

export function usePetInfoApi(petKind) {
	
	const getApiUrl = (kind) => {
		const lowerCaseKind = kind?.toLowerCase();
		if (lowerCaseKind === "cat") {
			return "https://api.thecatapi.com/v1/breeds";
		} else if (lowerCaseKind === "dog") {
			return "https://dog.ceo/api/breeds/list/all";
		}
		return null;
	};

	// Create a computed URL that updates when petKind changes
	const url = computed(() => getApiUrl(petKind.value));

	// Check if URL is valid
	if (!url.value) {
		return {
			data: ref(null),
			error: ref(
				new Error('Invalid pet kind specified. Please use "dog" or "cat".')
			),
			isFetching: ref(false),
			breedNames: computed(() => [])
		};
	}

	const { data, error, isFetching, execute } = useFetch(url, { immediate: false }).get().json();

	// Watch petKind and re-fetch when it changes
	watch(
		() => petKind.value,
		async (newKind) => {
			if (newKind) {
				await execute();
			}
		},
		{ immediate: true } 
	);

	// Process breed names based on pet kind
	const breedNames = computed(() => {
		if (isFetching.value || !data.value) return [];

		// Handle Cat API response
		if (petKind.value?.toLowerCase() === "cat") {
			// Cat API returns an array of breed objects with 'name' property
			return data.value.map((breed) => breed.name).sort();
		}

		// Handle Dog API response
		if (petKind.value?.toLowerCase() === "dog") {
			// Dog API returns { "message": { "breed": ["subbreed1", "subbreed2"], ... }, "status": "success" }
			const breedsObject = data.value.message;

			if (!breedsObject) return [];
			
			const breedList = [];
			
			// Process each breed
			for (const breed in breedsObject) {
				const subBreeds = breedsObject[breed];
				
				if (subBreeds.length === 0) {
					// No sub-breeds, just add the main breed (capitalize first letter)
					breedList.push(capitalizeBreed(breed));
				} else {
					// Has sub-breeds, add each combination
					subBreeds.forEach((subBreed) => {
						// Format as "Sub-breed Breed" (e.g., "Australian Shepherd")
						breedList.push(`${capitalizeBreed(subBreed)} ${capitalizeBreed(breed)}`);
					});
				}
			}
			
			return breedList.sort(); // Sort alphabetically
		}
		
		return [];
	});

	// Helper function to capitalize breed names
	const capitalizeBreed = (str) => {
		return str
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	return {
		breedNames,
		error,
		isFetching,
		data
	};
}
