// src/composables/usePetInfoApi.js
import { useFetch } from "@vueuse/core";
import { ref, computed } from 'vue';

export function usePetInfoApi(petKind) {
	
	const getApiUrl = (kind) => {
		const lowerCaseKind = kind.toLowerCase();
		if (lowerCaseKind === "cat") {
			return "https://api.thecatapi.com/v1/breeds";
		} else if (lowerCaseKind === "dog") {
			return "https://dog.ceo/api/breeds/list/all";
		}
		return null; // Return null if the kind is not recognized
	};

	const url = getApiUrl(petKind);

	if (!url) {
		return {
			data: ref(null),
			error: ref(
				new Error('Invalid pet kind specified. Please use "dog" or "cat".')
			),
			isFetching: ref(false),
			breedNames: computed(() => [])
		};
	}

	// Invoke API
	const { data, error, isFetching } = useFetch(url).get().json();

	const breedNames = computed(() => {
		if (!data.value) return [];

		if (petKind.toLowerCase() === "cat") {
			return data.value.map((breed) => breed.name);
		}

		// Dogs are weird, the json object for breeds are nested....
		if (petKind.toLowerCase() === "dog") {
			const breedsObject = data.value?.message;

			if (!breedsObject) return [];

			const breedNames = [];
			for (const breed in breedsObject) {
				if (breedsObject[breed].length === 0) {
					breedNames.push(breed); // Main breed, no sub-breeds
				} else {
					// Handle sub-breeds, e.g., "terrier" -> "terrier (westhighland)"
					breedsObject[breed].forEach((subBreed) => {
						breedNames.push(`${breed} (${subBreed})`);
					});
				}
			}
			return breedNames.sort(); // Sort alphabetically
		}

		return [];
	});

	return {
		breedNames,
		error,
		isFetching,
	};
}
