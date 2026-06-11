import { supabase } from '../utils/SupabaseClients';

export const GoogleLogin = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:5173'
            }
        });

        if (error) {
            console.error('Error signing in with google: ', error);
            return { success: false, error };
        } else {
            console.log("Google login success: ", data);
            return { success: true, data };
        }
    } catch (err) {
        console.error('Unexpected error during Google login: ', err);
        return { success: false, error: err };
    }
}