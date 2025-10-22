import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const player = useVideoPlayer(require('../assets/videos/hero-loop.mp4'), (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  // State for showing role buttons
  const [showRoles, setShowRoles] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showRoles) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [showRoles]);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        allowsFullscreen={false}
      />

      <View style={styles.overlay}>
        {!showRoles ? (
          <TouchableOpacity style={styles.mainButton} onPress={() => setShowRoles(true)}>
            <Text style={styles.mainButtonText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => router.push('/(landowner)/dashboard')}
            >
              <Text style={styles.roleText}>Landowner</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => router.push('/(issuer)/dashboard')}
            >
              <Text style={styles.roleText}>Issuer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => router.push('/(verifier)/dashboard')}
            >
              <Text style={styles.roleText}>Verifier</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // push buttons to bottom
    alignItems: 'center',
    paddingBottom: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // subtle dark overlay
  },

  mainButton: {
    backgroundColor: '#00a86b',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  buttonContainer: {
    width: '80%',
    gap: 16,
  },

  roleButton: {
    backgroundColor: '#00a86b',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  roleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
