export type InviteStatus = 'pending' | 'accepted' | 'rejected';

export function InviteStatusFromDb(statusFromDb: number): InviteStatus {
	switch (statusFromDb) {
		case 0:
			return 'pending';
		case 1:
			return 'accepted';
		case 2:
			return 'rejected';
		default:
			throw new Error('Invalid status');
	}
}

export function InviteStatusToDb(status: InviteStatus): number {
	switch (status) {
		case 'pending':
			return 0;
		case 'accepted':
			return 1;
		case 'rejected':
			return 2;
		default:
			throw new Error('Invalid status');
	}
}
