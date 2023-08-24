import { toastStore } from '@skeletonlabs/skeleton';

export function DisplayErrorToast(message: string = 'An unexpected error has occurred.') {
	DisplayToast(message, 'variant-filled-error');
}

export function DisplayToast(message: string, background: string) {
	toastStore.trigger({
		message: message,
		background: background,
		timeout: 5000
	});
}
