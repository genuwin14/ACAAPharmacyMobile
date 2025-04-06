import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedInUser = await AsyncStorage.getItem('loggedInUser');
      setLoading(false);

      if (loggedInUser) {
        // Redirect to profile if the user is logged in
        router.replace('/login');
      } else {
        // Redirect to login if the user is not logged in
        router.replace('/login');
      }
    };

    checkLoginStatus();
  }, [router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return null; // We don't need to render anything here; it's handled by the router replace.
}
