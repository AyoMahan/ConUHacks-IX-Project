import { error } from '@sveltejs/kit';

export function load({ params }) {
    return {
        gameId: params.gameId
    }
}