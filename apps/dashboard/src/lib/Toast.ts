import { toastStore } from '@skeletonlabs/skeleton';

export function DisplaySuccessToast(message: string) {
	DisplayToast(message, 'variant-filled-success');
}

export function DisplayErrorToast(message: string = 'An unexpected error has occurred.') {
	DisplayToast(message, 'variant-filled-error');
}

function DisplayToast(message: string, background: string) {
	toastStore.trigger({
		message: message,
		background: background,
		timeout: 5000
	});
}
