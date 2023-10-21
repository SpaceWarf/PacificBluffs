import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
export const triggerDiscordWebhook = httpsCallable(functions, 'triggerDiscordWebhook');
