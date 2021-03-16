import { useEffect } from 'react'

export const getStorageItem = (key, initialValue, storage) => {
	const storageValue = storage.getItem(key)
	if (storageValue == null) {
		return initialValue
	}
	try {
		return JSON.parse(storageValue)
	} catch (err) {
		return initialValue
	}
}

export const useUpdateStorage = (key, value, storage) => {
	useEffect(() => {
		if (value == null) {
			storage.removeItem(key)
		} else {
			storage.setItem(key, JSON.stringify(value))
		}
	}, [value])
}
